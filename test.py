import unittest
from unittest.mock import MagicMock
import chess
from projekt.chessGame import ChessGame
import socketio
class TestStringMethods(unittest.TestCase):

    def setUp(self):
        self.chessGame = ChessGame("chess1", socketio.Server())

    def test_upper(self):
        self.chessGame.setBlackPlayer("black")
        self.assertEqual('black', self.chessGame.blackPlayerSid)

    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)

class TestChessGame(unittest.TestCase):

    def test_first(self):
        chess = ChessGame("chess1", socketio.Server())
        chess.board.is_checkmate = MagicMock()
        chess.checkGameOver()
        chess.board.is_checkmate.assert_called_with()



    # def checkGameOver(self):
    #     # checkmate
    #     if self.board.is_checkmate():
    #         self.sio.emit("blockMovement", room=self.roomNr)
    #         self.sio.emit("message", 'CHECKMATE', room=self.roomNr)


# real = ProductionClass()
# real.something = MagicMock()
# real.method()
# real.something.assert_called_once_with(1, 2, 3)




if __name__ == '__main__':
    unittest.main()