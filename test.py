import unittest
from unittest.mock import MagicMock
import chess
from projekt.chessGame import ChessGame
import socketio

# unittest.TestLoader.sortTestMethodsUsing = None
# class TestStringMethods(unittest.TestCase):

#     def setUp(self):
#         self.chessGame = ChessGame("chess1", socketio.Server())

#     def test_upper(self):
#         self.chessGame.setBlackPlayer("black")
#         self.assertEqual('black', self.chessGame.blackPlayerSid)

#     def test_isupper(self):
#         self.assertTrue('FOO'.isupper())
#         self.assertFalse('Foo'.isupper())

#     def test_split(self):
#         s = 'hello world'
#         self.assertEqual(s.split(), ['hello', 'world'])
#         # check that s.split fails when the separator is not a string
#         with self.assertRaises(TypeError):
#             s.split(2)

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






    def test_first(self):
        self.chess.board.is_checkmate = MagicMock()
        self.chess.checkGameOver()
        self.chess.board.is_checkmate.assert_called_with()

    def test_check_legal_moves_number(self):
        self.assertEquals(len(list(self.chess.getLegalMoves())), 20) 

    def test_promotion(self):
        self.make_before_promotion_state()
        self.chess.promotePawn = MagicMock()
        self.chess.endTurn('1', 'f7g8') #white = 1
        self.chess.promotePawn.assert_called_with(chess.Move.from_uci('f7g8q'), '1')

    def test_end_promotion(self):
        self.make_before_promotion_state()
        self.chess.removePiece = MagicMock()
        self.chess.sio.emit = MagicMock()
        self.chess.endPromotion('f7g8q', '1')
        self.chess.removePiece.assert_has_calls(self.chess.removePiece('g8'))
        # print("ENDPROMOTION:", self.chess.board)


    def test_promoted_piece_successfully_added(self):
        # print('PIECE BOARD: ', self.chess.board)
        self.make_before_promotion_state()
        self.chess.endPromotion('f7g8q', '1')
        self.assertEqual(self.chess.board.piece_at(chess.G8).symbol(), 'Q')

    def test_checkmate(self):
        self.make_white_win_scholars_mate()
        self.chess.sio.emit = MagicMock()
        self.chess.sio.emit.assert_has_calls(
            self.chess.sio.emit("message", {'text': 'CHECKMATE'}, room='chess1'),
            self.chess.sio.emit("blockMovement", room='chess1'))

    def checkGameOver(self):
        # checkmate
        if self.board.is_checkmate():
            self.sio.emit("blockMovement", room=self.roomNr)
            self.sio.emit("message", {'text': 'CHECKMATE'}, room=self.roomNr)
            self.gameFinished = True
        # resignation
        


        # timeout



        # stalemate
        if self.board.is_stalemate():
            self.sio.emit("blockMovement", room=self.roomNr)
            self.sio.emit("message", {'text': 'STALEMATE'}, room=self.roomNr)
            self.gameFinished = True
        
        # insufficient material
        if self.board.is_insufficient_material():
            self.sio.emit("blockMovement", room=self.roomNr)
            self.sio.emit("message", {'text': 'INSUFFICIENT MATERIAL'}, room=self.roomNr)
            self.gameFinished = True

        # 50 move rule This allows either of the player to ask for a draw if there is no capture that has been made or any of the paws haven’t moved since the past 50 moves.
        if self.board.is_fifty_moves():
            pass
            # TODO: add emit which asks player for draw
            # self.sio.emit("blockMovement", room=self.roomNr)
            # self.sio.emit("message", 'CHECKMATE', room=self.roomNr)

        # repetition
        if self.board.is_repetition():
            self.sio.emit("blockMovement", room=self.roomNr)
            self.sio.emit("message", {'text': 'REPETITION'}, room=self.roomNr)
            self.gameFinished = True

        # agreement 
        # one player asks for draw




if __name__ == '__main__':
    unittest.main()