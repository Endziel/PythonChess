import chess 

class Room:
    def __init__(self, sio, roomNr):
        self.sio = sio
        self.roomNr = roomNr
        self.whitePlayerSid = ""
        self.blackPlayerSid = ""
        self.board = chess.Board()

        self.call_backs()
    
    def call_backs(self):
        @self.sio.on('endTurn' + str())
        def endTurn(sid, pieceMove):
            print(pieceMove, sid)
            if self.check() != None:
                pass

            if pieceMove[0:2] == pieceMove[2:]:
                self.repeatMove(sid)
                return

            move = chess.Move.from_uci(pieceMove)
            
            print("pieceMove: ", pieceMove)
            # print()
            print(self.board)
            print(self.sio.rooms(sid), "sid:", sid)
            if move in self.board.legal_moves:
                # self.makeMove(pieceMove, sid, capture=self.capturedPiece(move))
                self.makeMove(pieceMove, sid, capture=self.board.is_capture(move))
                self.board.push(move)
                # print(self.board.find_move(chess.parse_square(pieceMove[0:2]), chess.parse_square(pieceMove[2:])))
            else:
                self.repeatMove(sid)
            # roomNr = self.sio.rooms(sid)
            # self.sio.emit("updateBoard", pieceStart + "_" + pieceEnd, room=roomNr)
            # self.sio.emit("unblockMovement", room=roomNr,skip_sid=sid)
            # self.sio.emit("blockMovement", to=sid)


        @self.sio.event
        def message(sid, data):
            print('message ', data)
            # roomNr = self.sio.rooms(sid)
            # print(roomNr)
            self.sio.emit("message", data, room=self.roomNr, skip_sid=sid  )

    def check(self):
        return self.board.outcome()

    # def capturedPiece(self, move):
    #     if self.board.is_capture(move):
    #         if self.board.is_en_passant(move):
    #             return chess.PAWN
    #         else:
    #             return self.board.piece_at(move.to_square).piece_type
    #     return 0

    def makeMove(self, move, lastMoveSid, capture=False):
        print(capture)
        if capture:
            self.removePiece(move[2:])
        self.sio.emit("updateBoard", move, room=self.roomNr)
        self.sio.emit("blockMovement",to=lastMoveSid)
        self.sio.emit("unblockMovement", room=self.roomNr, skip_sid=lastMoveSid)

        # self.sio.emit()
            

    def removePiece(self, piecePosition):
        self.sio.emit("removePiece", piecePosition, room=self.roomNr)

    def repeatMove(self,lastMoveSid):
        self.sio.emit("unblockMovement", to=lastMoveSid)

    
    def startGame(self):
        self.sio.emit("startGameWhite", "white", to=self.whitePlayerSid)
        self.sio.emit("startGameBlack", "black", to=self.blackPlayerSid)
        self.sio.emit("message", self.roomNr, room=self.roomNr)



    def setWhitePlayer(self, sid):
        self.whitePlayerSid = sid

    def setBlackPlayer(self, sid):
        self.blackPlayerSid = sid