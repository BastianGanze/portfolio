use board_game::board::Board;
use board_game::games::connect4::Connect4;
use board_game::games::go::{GoBoard, Komi, Rules, SpacetimeGoBoard};
use board_game::games::ttt::TTTBoard;
use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Debug, Clone, PartialEq, Copy)]
pub enum DbBoardGameParam {
    TicTacToe,
    Connect4,
    Go,
}

impl From<DbBoardGameParam> for DbBoardGame {
    fn from(param: DbBoardGameParam) -> Self {
        match param {
            DbBoardGameParam::TicTacToe => DbBoardGame::TicTacToe(TTTBoard::default()),
            DbBoardGameParam::Connect4 => DbBoardGame::Connect4(Connect4::default()),
            DbBoardGameParam::Go => DbBoardGame::Go(SpacetimeGoBoard::from(GoBoard::new(
                9,
                Komi::new(7),
                Rules {
                    allow_multi_stone_suicide: false,
                },
            ))),
        }
    }
}

#[derive(SpacetimeType, Debug, Clone, PartialEq)]
pub enum DbBoardGameMove {
    TicTacToe(<TTTBoard as Board>::Move),
    Connect4(<Connect4 as Board>::Move),
    Go(<GoBoard as Board>::Move),
}

#[derive(SpacetimeType, Debug, Clone, PartialEq)]
pub enum DbBoardGame {
    TicTacToe(TTTBoard),
    Connect4(Connect4),
    Go(SpacetimeGoBoard),
}
