import eventlet
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': 'projekt/public/index.html',
    '/projekt/public': 'projekt/public'
})

counter = 1
    
@sio.event
def connect(sid, environ):
    # numClients = sio.
    global counter
    counter = counter + 1

    sio.enter_room(sid, 'chess' + str(counter//2))
    if counter%2 == 1:
        sio.emit("startGameWhite", "white", room='chess' + str(counter//2),skip_sid=sid)
        sio.emit("startGameBlack", "black", to=sid)
    

    
    print('connect ', sid, "roomNr:", counter//2)
    

# @sio.on('my custom event', namespace='/chat')
# @sio.event
# def startgame

@sio.event
def message(sid, data):
    print('message ', data)
    roomNr = sio.rooms(sid)
    print(roomNr)
    sio.emit("message", data, room=roomNr)



@sio.event
def disconnect(sid):
    print('disconnect ', sid)
    sio.leave_room(sid, 'chess')

    
if __name__ == '__main__':
    #import eventy
    
    eventlet.wsgi.server(eventlet.listen(('', 5555)), app)
    