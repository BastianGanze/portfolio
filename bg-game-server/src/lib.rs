pub mod board_games;
pub mod math;

use crate::board_games::{DbBoardGameMove, DbBoardGameParam};
use board_game::board::{Board, Outcome, Player};
use board_games::DbBoardGame;
use math::DbVector2;
use spacetimedb::{reducer, table, Identity, ReducerContext, Table, Timestamp, TryInsertError};

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

#[derive(Debug, Clone)]
#[table(name = versus_game_instance, public)]
pub struct VersusGameInstance {
    #[primary_key]
    #[auto_inc]
    id: GameInstanceId,
    player_one: Option<Identity>,
    player_two: Option<Identity>,
    next_player: Player,
    game_done: bool,
    outcome: Option<Outcome>,
    game_state_param: DbBoardGameParam,
    game_state: DbBoardGame,
}

impl VersusGameInstance {
    pub fn next_player(&self) -> Option<Player> {
        match &self.game_state {
            DbBoardGame::TicTacToe(board) => Some(board.next_player()),
            DbBoardGame::Connect4(_) => None,
        }
    }
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
        ctx.db.room().id().update(Room {
            users: room.users + 1,
            ..room
        });
    } else {
        ctx.db.room().insert(Room {
            users: 1,
            id: room_id,
        });
    }
}

pub fn remove_user_from_room(ctx: &ReducerContext, room_id: RoomId) {
    if let Some(room) = ctx.db.room().id().find(room_id) {
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
    log::warn!("${} connected", ctx.sender);
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User {
            online: true,
            ..user
        });
    } else {
        log::warn!("User not found!");
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

pub fn is_move_allowed(player_id: Identity, versus_game_instance: &VersusGameInstance) -> bool {
    if versus_game_instance.player_one.is_none() || versus_game_instance.player_two.is_none() {
        return false;
    }
    if let Some(player) = match player_id {
        id if versus_game_instance
            .player_one
            .is_some_and(|player_one_id| id == player_one_id) =>
        {
            Some(Player::A)
        }
        id if versus_game_instance
            .player_two
            .is_some_and(|player_two_id| id == player_two_id) =>
        {
            Some(Player::B)
        }
        _ => None,
    } {
        return versus_game_instance
            .next_player()
            .is_some_and(|p| p == player);
    }
    false
}

#[reducer]
pub fn make_board_game_move(
    ctx: &ReducerContext,
    game_instance_id: GameInstanceId,
    mv: DbBoardGameMove,
) {
    if let Some(mut game_instance) = ctx.db.versus_game_instance().id().find(game_instance_id) {
        if !is_move_allowed(ctx.sender, &game_instance) {
            log::error!("Move was not allowed!");
            return;
        }
        match game_instance.game_state {
            DbBoardGame::TicTacToe(ref mut board) => {
                if let DbBoardGameMove::TicTacToe(ttt_move) = mv {
                    match board.play(ttt_move) {
                        Ok(()) => {}
                        Err(err) => {
                            log::error!("Could not make move! {:?}", err);
                        }
                    }
                    game_instance.game_done = board.is_done();
                    game_instance.outcome = board.outcome();
                    game_instance.next_player = board.next_player();
                }
            }
            DbBoardGame::Connect4(_) => {}
        }
        ctx.db.versus_game_instance().id().update(game_instance);
    }
}

pub fn make_random_move(ctx: &ReducerContext, board: &mut impl Board) {
    match board.random_available_move(&mut ctx.rng()) {
        Ok(mv) => match board.play(mv) {
            Ok(()) => {}
            Err(err) => {
                log::error!("Could not make move! {:?}", err);
            }
        },
        Err(_) => {
            log::error!("Board done, could not make move!");
        }
    }
}

#[reducer]
pub fn make_random_board_game_move(ctx: &ReducerContext, game_instance_id: GameInstanceId) {
    if let Some(mut game_instance) = ctx.db.versus_game_instance().id().find(game_instance_id) {
        match game_instance.game_state {
            DbBoardGame::TicTacToe(ref mut board) => make_random_move(ctx, board),
            DbBoardGame::Connect4(_) => {}
        }

        ctx.db.versus_game_instance().id().update(game_instance);
    }
}

pub fn create_game_instance(
    ctx: &ReducerContext,
    game_param: DbBoardGameParam,
) -> Result<VersusGameInstance, TryInsertError<versus_game_instance__TableHandle>> {
    ctx.db
        .versus_game_instance()
        .try_insert(VersusGameInstance {
            id: 0,
            game_state_param: game_param,
            game_state: DbBoardGame::from(game_param),
            player_one: Some(ctx.sender),
            player_two: None,
            outcome: None,
            next_player: Player::A,
            game_done: false,
        })
}

pub fn find_free_game_instance(
    ctx: &ReducerContext,
    game_param: DbBoardGameParam,
) -> Option<VersusGameInstance> {
    ctx.db.versus_game_instance().iter().find(|instance| {
        !instance.game_done
            && (instance.player_one.is_none() || instance.player_two.is_none())
            && instance.game_state_param == game_param
    })
}

#[reducer]
pub fn join_random_game(ctx: &ReducerContext, game_param: DbBoardGameParam) {
    if let Some(mut game_instance) = find_free_game_instance(ctx, game_param) {
        if game_instance.player_one.is_none() {
            game_instance.player_one = Some(ctx.sender);
        } else {
            game_instance.player_two = Some(ctx.sender);
        }
        ctx.db.versus_game_instance().id().update(game_instance);
    } else if let Err(err) = create_game_instance(ctx, game_param) {
        log::error!("Failed to create new game instance: {:?}", err);
    }
}
