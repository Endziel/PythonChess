import eventlet
import socketio
import threading
from chessGame import ChessGame

class Server:
    def __init__(self):
        self.sio = socketio.Server()
        self.app = socketio.WSGIApp(self.sio, static_files={
                '/': 'projekt/public/index.html',
                '../../projekt/public': 'projekt/public',
                '../../projekt/three': 'projekt/three',
                '/projekt/public': 'projekt/public',
                '/projekt/three': 'projekt/three'
            })
        self.counter = 1
        self.listOfRooms = {}
        self.counter_lock = threading.Lock()
        self.call_backs()
        eventlet.wsgi.server(eventlet.listen(('', 8000)), self.app)

    def call_backs(self):
        @self.sio.event
        def connect(sid, environ):
            with self.counter_lock:
                self.counter = self.counter + 1

                roomNr = 'chess' + str(self.counter//2)
                self.sio.enter_room(sid, roomNr)

                # if self.counter%2 == 0:
                #     self.listOfRooms[roomNr] = Room(self.sio, roomNr);
                #     self.listOfRooms[roomNr].setWhitePlayer(sid);
                # if self.counter%2 == 1:
                #     self.listOfRooms[roomNr].setBlackPlayer(sid);
                #     self.listOfRooms[roomNr].startGame();

                


                if self.counter%2 == 0:
                    self.listOfRooms[roomNr] = ChessGame(roomNr, self.sio)
                    self.listOfRooms[roomNr].setWhitePlayer(sid)
                if self.counter%2 == 1:
                    self.listOfRooms[roomNr].setBlackPlayer(sid)
                    self.sio.emit("startGameWhite", {'text': "white", 'legalMoves': self.listOfRooms[roomNr].getLegalMoves()}, to=self.listOfRooms[roomNr].getWhitePlayerSid())
                    self.sio.emit("startGameBlack", {'text': "black", 'legalMoves': None}, to=self.listOfRooms[roomNr].getBlackPlayerSid())
                    self.sio.emit("message", {'text': roomNr}, room=roomNr)


                    # self.sio.emit("startGameWhite", "white", room='chess' + str(self.counter//2),skip_sid=sid)
                    # self.sio.emit("startGameBlack", "black", to=sid)
                

                
                print('connect ', sid, "roomNr:", self.counter//2)
            

        @self.sio.event
        def endTurn(sid, pieceMove):
            roomNr = self.getRoomNumber(sid)
            self.listOfRooms[roomNr].endTurn(sid,pieceMove)
            

        @self.sio.event
        def endPromotion(sid, pieceMove):
            roomNr = self.getRoomNumber(sid)
            self.listOfRooms[roomNr].endPromotion(pieceMove, sid)

        @self.sio.event
        def resign(sid):
            roomNr = self.getRoomNumber(sid)
            if not self.listOfRooms[roomNr].isFinished():
                self.listOfRooms[roomNr].resign(sid)

        @self.sio.event
        def drawProposal(sid):
            roomNr = self.getRoomNumber(sid)
            if not self.listOfRooms[roomNr].isFinished():
                self.listOfRooms[roomNr].drawProposal(sid)

        @self.sio.event
        def draw(sid, answer):
            roomNr = self.getRoomNumber(sid)
            self.listOfRooms[roomNr].draw(sid, answer)

        @self.sio.event
        def resetProposal(sid):
            roomNr = self.getRoomNumber(sid)
            self.listOfRooms[roomNr].resetProposal(sid)

        @self.sio.event
        def reset(sid, answer):
            roomNr = self.getRoomNumber(sid)
            self.listOfRooms[roomNr].reset(sid, answer)

        @self.sio.event
        def timeEnd(sid):
            roomNr = self.getRoomNumber(sid)
            self.listOfRooms[roomNr].timeEnd(sid)

        @self.sio.event
        def disconnect(sid):
            print('disconnect ', sid)
            self.sio.leave_room(sid, 'chess')

        @self.sio.event
        def message(sid, text):
            roomNr = self.getRoomNumber(sid)
            self.sio.emit("message", {'text': text, 'from': 'me'}, room=roomNr, to=sid)
            self.sio.emit("message", {'text': text, 'from': 'opponent'}, room=roomNr, skip_sid=sid)

    def getRoomNumber(self, sid):
        rooms = self.sio.rooms(sid)
        # indexOfArray = rooms.index("chess")
        roomNr = ""
        for room in rooms:
            if room.startswith("chess"):
                roomNr = room
                break
            
        # print(self.sio.rooms[indexOfArray])
        print(roomNr)
        return roomNr
        
        
if __name__ == '__main__':
    #import eventy
    server = Server()
    
