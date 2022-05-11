import eventlet
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': 'projekt/index.html',
    '/projekt/app.js': 'projekt/app.js'
})

# @sio.event
# def connect(sid, environ):
#     print('connect ', sid)

# @sio.event
# def message(sid, data):
#     print('message ', data)
#     sio.emit("message", data)

# @sio.event
# def disconnect(sid):
#     print('disconnect ', sid)

if __name__ == '__main__':
    #import eventy
    
    eventlet.wsgi.server(eventlet.listen(('', 5555)), app)
    