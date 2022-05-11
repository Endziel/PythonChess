

import chess


# class 
board = chess.Board()

print(board)
print("\n")
board.push_san("e4")
print(board)


sio = socketio.Server()


@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def message(sid, data):
    print('message ', data)
    sio.emit("message", data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)
