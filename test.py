import unittest
from unittest.mock import MagicMock
import chess
from projekt.chessGame import ChessGame
import socketio

class TestChessGame(unittest.TestCase):

    def setUp(self):
        self.chess = ChessGame("chess1", socketio.Server())
        
    def make_before_promotion_state(self):
        self.chess.endTurn('1', 'e2e4') #white = 1
        self.chess.endTurn('2', 'd7d5') #black = 2
        self.chess.endTurn('1', 'e4e5') #white = 1
        self.chess.endTurn('2', 'd5d4') #black = 2
        self.chess.endTurn('1', 'e5e6') #white = 1
        self.chess.endTurn('2', 'd4d3') #black = 2
        self.chess.endTurn('1', 'e6f7') #white = 1
        self.chess.endTurn('2', 'e8d7') #black = 2

    def make_white_win_scholars_mate(self):
        self.chess.endTurn('1', 'e2e4') #white = 1
        self.chess.endTurn('2', 'e7e5') #black = 2
        self.chess.endTurn('1', 'd1h5') #white = 1
        self.chess.endTurn('2', 'b8c6') #black = 2
        self.chess.endTurn('1', 'f1c4') #white = 1
        self.chess.endTurn('2', 'g8f6') #black = 2
        self.chess.endTurn('1', 'h5f7') 

    def make_stalemate(self):
        self.chess.endTurn('1', 'e2e3') #1
        self.chess.endTurn('2', 'a7a5') #2
        self.chess.endTurn('1', 'd1h5') #3
        self.chess.endTurn('2', 'a8a6') #4
        self.chess.endTurn('1', 'h5a5') #5
        self.chess.endTurn('2', 'h7h5') #6
        self.chess.endTurn('1', 'h2h4') #7
        self.chess.endTurn('2', 'a6h6') #8
        self.chess.endTurn('1', 'a5c7') #9
        self.chess.endTurn('2', 'f7f6') #10
        self.chess.endTurn('1', 'c7d7') #11
        self.chess.endTurn('2', 'e8f7') #12
        self.chess.endTurn('1', 'd7b7') #13
        self.chess.endTurn('2', 'd8d3') #14
        self.chess.endTurn('1', 'b7b8') #15
        self.chess.endTurn('2', 'd3h7') #16
        self.chess.endTurn('1', 'b8c8') #17
        self.chess.endTurn('2', 'f7g6') #18
        self.chess.endTurn('1', 'c8e6') #19

    def make_repetition(self):
        self.chess.endTurn('1', 'e2e3') #1
        self.chess.endTurn('2', 'e7e6') #2
        self.chess.endTurn('1', 'e1e2') #3
        self.chess.endTurn('2', 'e8e7') #4
        self.chess.endTurn('1', 'e2e1') #5
        self.chess.endTurn('2', 'e7e8') #6
        self.chess.endTurn('1', 'e1e2') #7
        self.chess.endTurn('2', 'e8e7') #8
        self.chess.endTurn('1', 'e2e1') #9
        self.chess.endTurn('2', 'e7e8') #10
        self.chess.endTurn('2', 'e1e2') #11
        self.chess.endTurn('2', 'e8e7') #12

    def test_first(self):
        self.chess.board.is_checkmate = MagicMock()
        self.chess.checkGameOver()
        self.chess.board.is_checkmate.assert_called_with()

    def test_check_legal_moves_number(self):
        self.assertEqual(len(list(self.chess.getLegalMoves())), 20) 

    def test_promotion(self):
        self.make_before_promotion_state()
        self.chess.promotePawn = MagicMock()
        self.chess.endTurn('1', 'f7g8') #white = 1
        self.chess.promotePawn.assert_called_with(chess.Move.from_uci('f7g8q'), '1')

    def test_end_promotion(self):
        self.make_before_promotion_state()
        self.chess.removePiece = MagicMock()
        self.chess.endPromotion('f7g8q', '1')
        self.chess.removePiece.assert_has_calls(self.chess.removePiece('g8'))

    def test_promoted_piece_successfully_added(self):
        self.make_before_promotion_state()
        self.chess.endPromotion('f7g8q', '1')
        self.assertEqual(self.chess.board.piece_at(chess.G8).symbol(), 'Q')

    def test_checkmate(self):
        self.make_white_win_scholars_mate()
        self.chess.sio.emit = MagicMock()
        self.chess.sio.emit.assert_has_calls(
            self.chess.sio.emit("message", {'text': 'CHECKMATE'}, room='chess1'),
            self.chess.sio.emit("blockMovement", room='chess1'))

    def test_stalemate(self):
        self.make_stalemate()
        self.chess.sio.emit = MagicMock()
        self.chess.sio.emit.assert_has_calls(
            self.chess.sio.emit("message", {'text': 'STALEMATE'}, room='chess1'),
            self.chess.sio.emit("blockMovement", room='chess1'))    

    def test_repetition(self):
        self.make_stalemate()
        self.chess.sio.emit = MagicMock()
        self.chess.sio.emit.assert_has_calls(
            self.chess.sio.emit("message", {'text': 'REPETITION'}, room='chess1'),
            self.chess.sio.emit("blockMovement", room='chess1'))    

    def test_draw_accept(self):
        self.chess.sio.emit = MagicMock()
        self.chess.draw('1', True)
        self.chess.sio.emit.assert_called_with("message", {'text': 'DRAW'}, room='chess1')


    
if __name__ == '__main__':
    unittest.main()