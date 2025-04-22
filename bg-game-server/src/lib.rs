pub mod board_games;
pub mod math;

use crate::board_games::{DbBoardGameMove, DbBoardGameParam};
use board_game::ai::mcts::MCTSBot;
use board_game::ai::Bot;
use board_game::board::{Board, Outcome, Player};
use board_games::DbBoardGame;
use math::DbVector2;
use spacetimedb::{
    reducer, table, Identity, ReducerContext, ScheduleAt, SpacetimeType, Table, TimeDuration,
    Timestamp, TryInsertError,
};

pub type RoomId = u32;
pub const LOBBY_ROOM: RoomId = 0;
pub type GameInstanceId = u32;
pub type UserId = u32;

#[derive(SpacetimeType, Debug, Clone, PartialEq)]
pub struct UserGameScores {
    game: DbBoardGameParam,
    won: u32,
    lost: u32,
    draws: u32,
}

#[table(name = user, public)]
pub struct User {
    #[primary_key]
    identity: Identity,
    name: String,
    first_seen: Timestamp,
    online: bool,
    connected: bool,
    game_instance_id: Option<GameInstanceId>,
    game_scores: Vec<UserGameScores>,
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
    match_started: bool,
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

#[table(name = timeout_user_schedule, scheduled(timeout_user))]
struct TimeoutUserSchedule {
    #[primary_key]
    #[auto_inc]
    scheduled_id: u64,
    scheduled_at: ScheduleAt,
    player_identity: Identity,
}

#[reducer]
fn timeout_user(ctx: &ReducerContext, timeout: TimeoutUserSchedule) {
    if ctx.sender != ctx.identity() {
        log::error!("Scheduled reducer should only be called by the module itself");
        return;
    }

    if let Some(user) = ctx.db.user().identity().find(timeout.player_identity) {
        if !user.connected && user.online {
            ctx.db.user().identity().update(User {
                online: false,
                ..user
            });
        }
        if let Some(user_cursor) = ctx
            .db
            .user_cursor()
            .identity()
            .find(timeout.player_identity)
        {
            remove_user_from_room(ctx, user_cursor.room);
            ctx.db.user_cursor().delete(user_cursor);
        }
    } else {
        log::warn!(
            "Timeout event for unknown user with identity {:?}",
            timeout.player_identity
        );
    }
}

#[table(name = bot_move_scheduler, scheduled(bot_move))]
struct BotMoveScheduler {
    #[primary_key]
    #[auto_inc]
    scheduled_id: u64,
    scheduled_at: ScheduleAt,
    game_instance_id: GameInstanceId,
}

#[reducer]
fn bot_move(ctx: &ReducerContext, timeout: BotMoveScheduler) {
    if ctx.sender != ctx.identity() {
        log::error!("Scheduled reducer should only be called by the module itself");
        return;
    }

    if let Some(mut game_instance) = ctx
        .db
        .versus_game_instance()
        .id()
        .find(timeout.game_instance_id)
    {
        let mut bot = MCTSBot::new(100, 2.0, ctx.rng());
        if let Ok(mv) = match game_instance.game_state {
            DbBoardGame::TicTacToe(ref mut board) => bot
                .select_move(board)
                .map(DbBoardGameMove::TicTacToe)
                .map_err(|m| format!("Bot error: {:?}", m)),
            DbBoardGame::Connect4(_) => Err("Connect4 bot not implemented".to_string()),
        } {
            _make_board_game_move(ctx, timeout.game_instance_id, mv, true);
        }
    } else {
        log::warn!(
            "Timeout event for unknown game instance with id {:?}",
            timeout.game_instance_id
        );
    }
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
    if ctx
        .db
        .user_cursor()
        .try_insert(UserCursor {
            identity: ctx.sender,
            room: LOBBY_ROOM,
            position: DbVector2 { x: 0.0, y: 0.0 },
        })
        .is_ok()
    {
        add_user_to_room(ctx, LOBBY_ROOM);
    }
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User {
            connected: true,
            online: true,
            ..user
        });
    } else {
        ctx.db.user().insert(User {
            name: "Test".into(),
            identity: ctx.sender,
            first_seen: ctx.timestamp,
            connected: true,
            online: true,
            game_instance_id: None,
            game_scores: vec![],
        });
    }
    for timeout_schedule in ctx
        .db
        .timeout_user_schedule()
        .iter()
        .filter(|schedule| schedule.player_identity == ctx.sender)
    {
        ctx.db.timeout_user_schedule().delete(timeout_schedule);
    }
}

#[reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User {
            connected: false,
            ..user
        });
        let fifteen_seconds = TimeDuration::from_micros(15_000_000);
        let future_timestamp: Timestamp = ctx.timestamp + fifteen_seconds;
        ctx.db.timeout_user_schedule().insert(TimeoutUserSchedule {
            scheduled_id: 0,
            player_identity: ctx.sender,
            scheduled_at: future_timestamp.into(),
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

pub fn is_move_allowed(
    player_id: Identity,
    versus_game_instance: &VersusGameInstance,
    bot_move: bool,
) -> bool {
    if !versus_game_instance.match_started && versus_game_instance.game_done {
        return false;
    }
    if bot_move {
        return true;
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

#[derive(SpacetimeType, Debug, Copy, Clone, Eq, PartialEq, Hash)]
pub enum GameOutcome {
    Won,
    Lost,
    Draw,
}
pub fn increase_player_score_by_outcome(
    ctx: &ReducerContext,
    player_identity: Identity,
    game_state_param: DbBoardGameParam,
    outcome: GameOutcome,
) {
    if let Some(user) = ctx.db.user().identity().find(player_identity) {
        let mut game_scores = user.game_scores.clone();
        let game_score_index = match game_scores
            .iter()
            .position(|score| score.game == game_state_param)
        {
            Some(index) => index,
            None => {
                game_scores.push(UserGameScores {
                    game: game_state_param,
                    won: 0,
                    lost: 0,
                    draws: 0,
                });
                game_scores.len() - 1
            }
        };
        match outcome {
            GameOutcome::Won => game_scores[game_score_index].won += 1,
            GameOutcome::Draw => game_scores[game_score_index].draws += 1,
            GameOutcome::Lost => game_scores[game_score_index].lost += 1,
        }
        ctx.db.user().identity().update(User {
            game_scores,
            ..user
        });
    }
}

fn _make_board_game_move(
    ctx: &ReducerContext,
    game_instance_id: GameInstanceId,
    mv: DbBoardGameMove,
    is_bot: bool,
) {
    if let Some(mut game_instance) = ctx.db.versus_game_instance().id().find(game_instance_id) {
        if !is_move_allowed(ctx.sender, &game_instance, is_bot) {
            log::error!("Move was not allowed!");
            return;
        }
        let outcome_before_move = game_instance.outcome;
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
        if let (None, Some(outcome)) = (outcome_before_move, game_instance.outcome) {
            calculate_scores(ctx, &game_instance, outcome);
        }
        if is_next_player_a_bot(&game_instance) {
            schedule_bot_move(ctx, game_instance.id);
        }
        ctx.db.versus_game_instance().id().update(game_instance);
    }
}

#[reducer]
pub fn make_board_game_move(
    ctx: &ReducerContext,
    game_instance_id: GameInstanceId,
    mv: DbBoardGameMove,
) {
    _make_board_game_move(ctx, game_instance_id, mv, false);
}

fn calculate_scores(ctx: &ReducerContext, game_instance: &VersusGameInstance, outcome: Outcome) {
    match outcome {
        Outcome::WonBy(player_won) => {
            if let Some(player_won_identity) = match player_won {
                Player::A => game_instance.player_one,
                Player::B => game_instance.player_two,
            } {
                increase_player_score_by_outcome(
                    ctx,
                    player_won_identity,
                    game_instance.game_state_param,
                    GameOutcome::Won,
                );
            }
            if let Some(player_lost_identity) = match player_won {
                Player::A => game_instance.player_two,
                Player::B => game_instance.player_one,
            } {
                increase_player_score_by_outcome(
                    ctx,
                    player_lost_identity,
                    game_instance.game_state_param,
                    GameOutcome::Lost,
                );
            }
        }
        Outcome::Draw => {
            if let Some(player_one) = game_instance.player_one {
                increase_player_score_by_outcome(
                    ctx,
                    player_one,
                    game_instance.game_state_param,
                    GameOutcome::Draw,
                );
            }
            if let Some(player_two) = game_instance.player_two {
                increase_player_score_by_outcome(
                    ctx,
                    player_two,
                    game_instance.game_state_param,
                    GameOutcome::Draw,
                );
            }
        }
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
            match_started: false,
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
            && !instance.match_started
            && (instance.player_one.is_none() || instance.player_two.is_none())
            && instance.game_state_param == game_param
    })
}

pub fn find_current_players_running_game_instance(
    ctx: &ReducerContext,
) -> Option<VersusGameInstance> {
    ctx.db.versus_game_instance().iter().find(|instance| {
        (instance.player_one == Some(ctx.sender) || instance.player_two == Some(ctx.sender))
            && instance.outcome.is_none()
            && !instance.game_done
    })
}

#[reducer]
pub fn abandon_game(ctx: &ReducerContext) {
    if let Some(current_game_instance) = find_current_players_running_game_instance(ctx) {
        ctx.db
            .versus_game_instance()
            .id()
            .update(VersusGameInstance {
                game_done: true,
                ..current_game_instance
            });
    }
}

pub fn schedule_bot_move(ctx: &ReducerContext, game_instance_id: GameInstanceId) {
    let one_second = TimeDuration::from_micros(1_000_000);
    let future_timestamp: Timestamp = ctx.timestamp + one_second;
    ctx.db.bot_move_scheduler().insert(BotMoveScheduler {
        scheduled_id: 0,
        game_instance_id,
        scheduled_at: future_timestamp.into(),
    });
}

pub fn is_next_player_a_bot(game_instance: &VersusGameInstance) -> bool {
    match game_instance.next_player() {
        Some(Player::A) => game_instance.player_one.is_none(),
        Some(Player::B) => game_instance.player_two.is_none(),
        None => false,
    }
}

#[reducer]
pub fn force_start_game(ctx: &ReducerContext, instance_id: GameInstanceId) {
    if let Some(mut game_instance) = ctx.db.versus_game_instance().id().find(instance_id) {
        game_instance.match_started = true;
        if is_next_player_a_bot(&game_instance) {
            schedule_bot_move(ctx, game_instance.id);
        }
        ctx.db.versus_game_instance().id().update(game_instance);
    } else {
        log::error!("Game instance not found!");
    }
}

#[reducer]
pub fn join_random_game(ctx: &ReducerContext, game_param: DbBoardGameParam) {
    if let Some(mut game_instance) = find_free_game_instance(ctx, game_param) {
        if game_instance.player_one.is_none() {
            game_instance.player_one = Some(ctx.sender);
        } else {
            game_instance.player_two = Some(ctx.sender);
        }
        if (game_instance.player_one.is_some() && game_instance.player_two.is_some()) {
            game_instance.match_started = true;
        }
        ctx.db.versus_game_instance().id().update(game_instance);
    } else if let Err(err) = create_game_instance(ctx, game_param) {
        log::error!("Failed to create new game instance: {:?}", err);
    }
}
