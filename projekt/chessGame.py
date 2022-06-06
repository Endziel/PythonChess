import chess
class ChessGame:
    def __init__(self, roomNr, sio):
        self.sio = sio
        self.roomNr = roomNr
        self.whitePlayerSid = ""
        self.blackPlayerSid = ""
        self.board = chess.Board()

    def setWhitePlayer(self, sid):
        self.whitePlayerSid = sid

    def setBlackPlayer(self, sid):
        self.blackPlayerSid = sid

    def getWhitePlayerSid(self):
        return self.whitePlayerSid

    def getBlackPlayerSid(self):
        return self.blackPlayerSid

    def endTurn(self, sid, pieceMove):
        print(pieceMove, sid)
        if self.check() != None:
            pass

        if pieceMove[0:2] == pieceMove[2:]:
            self.repeatMove(sid)
            return

        move = chess.Move.from_uci(pieceMove)
        
        print("pieceMove: ", pieceMove)
        
        if move in self.board.legal_moves:
            self.makeMove(move, sid)
            self.board.push(move)
        else:
            if chess.Move.from_uci(pieceMove + 'q') in self.board.legal_moves:  # check for possible promotion
                # TODO: ask player for piece
                move = chess.Move.from_uci(pieceMove + 'q')
                self.promotePawn(move, sid)
                
            else:
                self.repeatMove(sid)
        
        print(self.board)
        print(self.sio.rooms(sid), "sid:", sid)
        print()


    def makeMove(self, move, lastMoveSid):
        print(self.board.is_capture(move))
        if self.board.is_capture(move):
            if self.board.is_en_passant(move):
                if lastMoveSid == self.blackPlayerSid:
                    self.removePiece(chess.square_name(move.to_square)[0] + str(int(chess.square_name(move.to_square)[1])+1))
                else:
                    self.removePiece(chess.square_name(move.to_square)[0] + str(int(chess.square_name(move.to_square)[1])-1))
                    
            else:
                self.removePiece(chess.square_name(move.to_square))


        if self.board.is_castling(move):
            if self.board.is_kingside_castling(move):
                # if self.board.has_kingside_castling_rights:
                if lastMoveSid == self.whitePlayerSid:
                    self.sio.emit("movePiece", "e1g1", room=self.roomNr)
                    self.sio.emit("movePiece", "h1f1", room=self.roomNr)
                else:
                    self.sio.emit("movePiece", "e8g8", room=self.roomNr)
                    self.sio.emit("movePiece", "h8f8", room=self.roomNr)
            else:
                if lastMoveSid == self.whitePlayerSid:
                    self.sio.emit("movePiece", "e1c1", room=self.roomNr)
                    self.sio.emit("movePiece", "a1d1", room=self.roomNr)
                else:
                    self.sio.emit("movePiece", "e8c8", room=self.roomNr)
                    self.sio.emit("movePiece", "a8d8", room=self.roomNr)
            self.sio.emit("blockMovement",to=lastMoveSid)
            self.sio.emit("unblockMovement", room=self.roomNr, skip_sid=lastMoveSid)
            return

        # print(self.board.find_move(chess.parse_square(pieceMove[0:2]), chess.parse_square(pieceMove[2:])))

        print("movePiece:", str(move))
        self.sio.emit("movePiece", str(move), room=self.roomNr)
        self.sio.emit("blockMovement",to=lastMoveSid)
        self.sio.emit("unblockMovement", room=self.roomNr, skip_sid=lastMoveSid)


    def promotePawn(self, move, lastMoveSid):
        self.sio.emit("promotePiece", str(move), to=lastMoveSid)
    
    def endPromotion(self, move, lastMoveSid):
        if lastMoveSid == self.whitePlayerSid:
            move = move[0:4] + move[4].upper()
        else:
            move = move[0:4] + move[4].lower()
        move = chess.Move.from_uci(move)
        self.board.push(move)
        self.sio.emit("movePiece", str(move), room=self.roomNr)
        self.sio.emit("blockMovement",to=lastMoveSid)
        self.sio.emit("unblockMovement", room=self.roomNr, skip_sid=lastMoveSid)

    def removePiece(self, piecePosition):
        self.sio.emit("removePiece", piecePosition, room=self.roomNr)

    def repeatMove(self,lastMoveSid):
        self.sio.emit("unblockMovement", to=lastMoveSid)

    def check(self):
        return self.board.outcome()