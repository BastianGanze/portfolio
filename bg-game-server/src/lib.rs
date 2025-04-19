pub mod board_games;
pub mod math;

use crate::board_games::{DbBoardGameMove, DbBoardGameParam};
use board_game::board::Board;
use board_games::DbBoardGame;
use math::DbVector2;
use spacetimedb::{reducer, table, Identity, ReducerContext, Table, Timestamp};

pub type RoomId = u32;
pub const LOBBY_ROOM: RoomId = 0;
pub type GameInstanceId = u32;

#[table(name = user, public)]
pub struct User {
    #[primary_key]
    identity: Identity,
    name: String,
    first_seen: Timestamp,
    online: bool,
    game_instance_id: Option<GameInstanceId>,
}

#[table(name = versus_game_instance, public)]
pub struct VersusGameInstance {
    #[primary_key]
    #[auto_inc]
    id: GameInstanceId,
    player_one: Option<Identity>,
    player_two: Option<Identity>,
    game_state: DbBoardGame,
}

#[table(name = room, public)]
pub struct Room {
    #[primary_key]
    id: RoomId,
    users: u32,
}

#[table(name = user_cursor, public)]
pub struct UserCursor {
    #[primary_key]
    identity: Identity,
    room: RoomId,
    position: DbVector2,
}

#[reducer(init)]
pub fn init(_ctx: &ReducerContext) {
    // Called when the module is initially published
}

pub fn add_user_to_room(ctx: &ReducerContext, room_id: RoomId) {
    if let Some(room) = ctx.db.room().id().find(room_id) {
        log::info!("add {:?}", room_id);
        ctx.db.room().id().update(Room {
            users: room.users + 1,
            ..room
        });
    } else {
        log::info!("add {:?}", room_id);
        ctx.db.room().insert(Room {
            users: 1,
            id: room_id,
        });
    }
}

pub fn remove_user_from_room(ctx: &ReducerContext, room_id: RoomId) {
    if let Some(room) = ctx.db.room().id().find(room_id) {
        log::info!("rm {:?}", room_id);
        ctx.db.room().id().update(Room {
            users: room.users - 1,
            ..room
        });
    } else {
        log::error!("Tried to remove user from room that did not exist!");
    }
}

#[reducer(client_connected)]
pub fn user_connected(ctx: &ReducerContext) {
    ctx.db.user_cursor().insert(UserCursor {
        identity: ctx.sender,
        room: LOBBY_ROOM,
        position: DbVector2 { x: 0.0, y: 0.0 },
    });
    add_user_to_room(ctx, LOBBY_ROOM);
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User {
            online: true,
            ..user
        });
    } else {
        ctx.db.user().insert(User {
            name: "Test".into(),
            identity: ctx.sender,
            first_seen: ctx.timestamp,
            online: true,
            game_instance_id: None,
        });
    }
}

#[reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        if let Some(user_cursor) = ctx.db.user_cursor().identity().find(ctx.sender) {
            remove_user_from_room(ctx, user_cursor.room);
            ctx.db.user_cursor().delete(user_cursor);
        }
        ctx.db.user().identity().update(User {
            online: false,
            ..user
        });
    } else {
        log::warn!(
            "Disconnect event for unknown user with identity {:?}",
            ctx.sender
        );
    }
}

#[reducer]
pub fn say_hello(ctx: &ReducerContext) {
    log::info!("Hello, World!");
    for user in ctx.db.user().iter() {
        log::info!("Hello, {:?}!", user.name);
    }
}

#[reducer]
pub fn move_position(ctx: &ReducerContext, position: DbVector2) -> Result<(), String> {
    let user_cursor = ctx
        .db
        .user_cursor()
        .identity()
        .find(ctx.sender)
        .ok_or("User cursor not found to move")?;

    ctx.db.user_cursor().identity().update(UserCursor {
        position,
        ..user_cursor
    });
    Ok(())
}

#[reducer]
pub fn move_to_room(ctx: &ReducerContext, room: RoomId) -> Result<(), String> {
    let user_cursor = ctx
        .db
        .user_cursor()
        .identity()
        .find(ctx.sender)
        .ok_or("User cursor not found to move")?;

    remove_user_from_room(ctx, user_cursor.room);
    add_user_to_room(ctx, room);

    ctx.db.user_cursor().identity().update(UserCursor {
        room,
        ..user_cursor
    });
    Ok(())
}

#[reducer]
pub fn create_game_instance(ctx: &ReducerContext, game_param: DbBoardGameParam) {
    if let Err(err) = ctx
        .db
        .versus_game_instance()
        .try_insert(VersusGameInstance {
            id: 0,
            game_state: DbBoardGame::from(game_param),
            player_one: Some(ctx.sender),
            player_two: None,
        })
    {
        log::error!("{:?}", err);
    }
}

#[reducer]
pub fn make_board_game_move(
    ctx: &ReducerContext,
    game_instance_id: GameInstanceId,
    mv: DbBoardGameMove,
) {
    if let Some(game_instance) = ctx.db.versus_game_instance().id().find(game_instance_id) {
        match game_instance.game_state {
            DbBoardGame::TicTacToe(mut board) => {
                if let DbBoardGameMove::TicTacToe(ttt_move) = mv {
                    match board.play(ttt_move) {
                        Ok(()) => {
                            ctx.db
                                .versus_game_instance()
                                .id()
                                .update(VersusGameInstance {
                                    game_state: DbBoardGame::TicTacToe(board),
                                    ..game_instance
                                });
                        }
                        Err(err) => {
                            log::error!("Could not make move! {:?}", err);
                        }
                    }
                }
            }
        }
    }
}

#[reducer]
pub fn make_random_board_game_move(ctx: &ReducerContext, game_instance_id: GameInstanceId) {
    if let Some(game_instance) = ctx.db.versus_game_instance().id().find(game_instance_id) {
        match game_instance.game_state {
            DbBoardGame::TicTacToe(mut board) => {
                match board.random_available_move(&mut ctx.rng()) {
                    Ok(mv) => match board.play(mv) {
                        Ok(()) => {
                            ctx.db
                                .versus_game_instance()
                                .id()
                                .update(VersusGameInstance {
                                    game_state: DbBoardGame::TicTacToe(board),
                                    ..game_instance
                                });
                        }
                        Err(err) => {
                            log::error!("Could not make move! {:?}", err);
                        }
                    },
                    Err(_) => {
                        log::error!("Board done, could not make move!");
                    }
                }
            }
        }
    }
}
