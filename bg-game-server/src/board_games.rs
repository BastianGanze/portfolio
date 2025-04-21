use board_game::board::Board;
use board_game::games::ttt::TTTBoard;
use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Debug, Clone, PartialEq, Copy)]
pub enum DbBoardGameParam {
    TicTacToe,
}

impl From<DbBoardGameParam> for DbBoardGame {
    fn from(param: DbBoardGameParam) -> Self {
        match param {
            DbBoardGameParam::TicTacToe => DbBoardGame::TicTacToe(TTTBoard::default()),
        }
    }
}

#[derive(SpacetimeType, Debug, Clone, PartialEq)]
pub enum DbBoardGameMove {
    TicTacToe(<TTTBoard as Board>::Move),
    Connect4(u8),
}

#[derive(SpacetimeType, Debug, Clone, PartialEq)]
pub enum DbBoardGame {
    TicTacToe(TTTBoard),
    Connect4(u8),
}
