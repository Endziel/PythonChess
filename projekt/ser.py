import eventlet
import socketio
from room import Room

class Server:
    def __init__(self):
        self.sio = socketio.Server()
        self.app = socketio.WSGIApp(self.sio, static_files={
                '/': 'projekt/public/index.html',
                '/projekt/public': 'projekt/public'
            })
        self.counter = 1
        self.listOfRooms = {}
        self.call_backs()
        eventlet.wsgi.server(eventlet.listen(('', 5555)), self.app)

    def call_backs(self):
        @self.sio.event
        def connect(sid, environ):
            # numClients = sio.
            # global counter
            # print("-----------------------------------", args)
            self.counter = self.counter + 1

            roomNr = 'chess' + str(self.counter//2)
            self.sio.enter_room(sid, roomNr)

            if self.counter%2 == 0:
                self.listOfRooms[roomNr] = Room(self.sio, roomNr);
                self.listOfRooms[roomNr].setWhitePlayer(sid);
            if self.counter%2 == 1:
                self.listOfRooms[roomNr].setBlackPlayer(sid);
                self.listOfRooms[roomNr].startGame();
                # self.sio.emit("startGameWhite", "white", room='chess' + str(self.counter//2),skip_sid=sid)
                # self.sio.emit("startGameBlack", "black", to=sid)
            

            
            print('connect ', sid, "roomNr:", self.counter//2)
            

        # @sio.on('my custom event', namespace='/chat')
        # @sio.event
        # def startgame

        
        # @self.sio.event
        # def message(sid, data):
        #     print('message ', data)
        #     roomNr = self.sio.rooms(sid)
        #     print(roomNr)
        #     self.sio.emit("message", data, room=roomNr)


        
        @self.sio.event
        def disconnect(sid):
            print('disconnect ', sid)
            self.sio.leave_room(sid, 'chess')

        
        




if __name__ == '__main__':
    #import eventy
    server = Server()
    