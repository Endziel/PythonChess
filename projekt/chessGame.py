import chess
class ChessGame:
    def __init__(self, roomNr, sio):
        self.sio = sio
        self.roomNr = roomNr
        self.whitePlayerSid = ""
        self.blackPlayerSid = ""
        self.board = chess.Board()
        self.gameFinished = False;

    def isFinished(self):
        return self.gameFinished

    def getLegalMoves(self):
        return [move.uci() for move in list(self.board.legal_moves)]

    def setWhitePlayer(self, sid):
        self.whitePlayerSid = sid

    def setBlackPlayer(self, sid):
        self.blackPlayerSid = sid

    def getWhitePlayerSid(self):
        return self.whitePlayerSid

    def getBlackPlayerSid(self):
        return self.blackPlayerSid

    def endTurn(self, sid, pieceMove):
        # print(pieceMove, sid)

        if pieceMove[0:2] == pieceMove[2:]:
            self.repeatMove(sid)
            return

        move = chess.Move.from_uci(pieceMove)
        
        # print("pieceMove: ", pieceMove)
        # print("legalMoves", self.getLegalMoves())
        if move in self.board.legal_moves:
            self.makeMove(move, sid)
            # self.board.push(move)
            self.checkGameOver()
        else:
            if chess.Move.from_uci(pieceMove + 'q') in self.board.legal_moves:  # check for possible promotion
                # print("promotePawn")
                move = chess.Move.from_uci(pieceMove + 'q')
                self.promotePawn(move, sid)
                
            else:
                self.repeatMove(sid)
        
        # print(self.board)
        # print(self.sio.rooms(sid), "sid:", sid)
        # print()


    def makeMove(self, move, lastMoveSid):
        # print(self.board.is_capture(move))
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
            self.board.push(move)
            self.sio.emit("blockMovement",to=lastMoveSid)
            self.sio.emit("unblockMovement", self.getLegalMoves(), room=self.roomNr, skip_sid=lastMoveSid)
            return

        # print(self.board.find_move(chess.parse_square(pieceMove[0:2]), chess.parse_square(pieceMove[2:])))

        # print("movePiece:", str(move))
        self.sio.emit("movePiece", str(move), room=self.roomNr)
        self.board.push(move)
        # print("makeMove: ", self.getLegalMoves())
        self.sio.emit("blockMovement",to=lastMoveSid)
        self.sio.emit("unblockMovement", self.getLegalMoves(), room=self.roomNr, skip_sid=lastMoveSid)


    def promotePawn(self, move, lastMoveSid):
        self.sio.emit("promotePiece", str(move), to=lastMoveSid)
    
    def endPromotion(self, move, lastMoveSid):
        move = move[0:4] + move[4].lower()
        move = chess.Move.from_uci(move)

        if self.board.is_capture(move):
            self.removePiece(chess.square_name(move.to_square))

        self.board.push(move)
        self.checkGameOver()

        self.removePiece(chess.square_name(move.from_square)) # removing pawn which was promoted
        self.sio.emit("addPromotedPiece", {
            "position": chess.square_name(move.to_square), 
            "pieceSymbol": move.uci()[-1], 
            "color": "white" if lastMoveSid == self.whitePlayerSid else "black"}, 
            room=self.roomNr)
        self.sio.emit("blockMovement",to=lastMoveSid)
        self.sio.emit("unblockMovement", self.getLegalMoves(), room=self.roomNr, skip_sid=lastMoveSid)

    def removePiece(self, piecePosition):
        self.sio.emit("removePiece", piecePosition, room=self.roomNr)

    def resign(self, resigningPlayerSid):
        self.sio.emit("message", {'text': 'RESIGNED'}, room=self.roomNr, to=resigningPlayerSid)
        self.sio.emit("message", {'text': 'YOUR OPPONENT HAS RESIGNED.'}, room=self.roomNr, skip_sid=resigningPlayerSid)
        self.sio.emit("blockMovement", room=self.roomNr)
        self.gameFinished = True

    def drawProposal(self, playerSid):
        self.sio.emit("drawProposal", room=self.roomNr, skip_sid=playerSid)
        self.sio.emit("blockMovement", room=self.roomNr)

    def draw(self, playerSid, answer):
        if answer:
            self.sio.emit("message", {'text': 'DRAW'}, room=self.roomNr)
            self.gameFinished = True
        else:
            self.sio.emit("message", {'text': 'Opponent didn\'t accept draw'}, room=self.roomNr, skip_sid=playerSid)
            if self.board.turn == chess.WHITE:
                self.sio.emit("unblockMovement", self.getLegalMoves(), to=self.whitePlayerSid)
            else:
                self.sio.emit("unblockMovement", self.getLegalMoves(), to=self.blackPlayerSid)
    

    def resetProposal(self, playerSid):
        self.sio.emit("resetProposal", room=self.roomNr, skip_sid=playerSid)
        self.sio.emit("blockMovement", room=self.roomNr)

    def reset(self, playerSid, answer):
        if answer:
                self.sio.emit("startGameWhite", {'text': "white", 'legalMoves': self.getLegalMoves()}, to=self.blackPlayerSid)
                self.sio.emit("startGameBlack", {'text': "black", 'legalMoves': None}, to=self.whitePlayerSid)
                tmp = self.blackPlayerSid
                self.blackPlayerSid = self.whitePlayerSid
                self.whitePlayerSid = tmp
                self.isFinished = False
                self.board = chess.Board()
        else:
            self.sio.emit("message", {'text': 'Opponent didn\'t accept restart'}, room=self.roomNr, skip_sid=playerSid)
            if self.board.turn == chess.WHITE:
                self.sio.emit("unblockMovement", self.getLegalMoves(), to=self.whitePlayerSid)
            else:
                self.sio.emit("unblockMovement", self.getLegalMoves(), to=self.blackPlayerSid)

    def timeEnd(self, playerSid):
        self.sio.emit("message", {'text': "YOUR TIME IS UP"}, to=playerSid)
        self.sio.emit("message", {'text': "OPPONENT TIME IS UP"}, skip_sid=playerSid)
        self.sio.emit("blockMovement", room=self.roomNr)
        self.gameFinished = True

    def checkGameOver(self):
        # checkmate
        if self.board.is_checkmate():
            self.sio.emit("blockMovement", room=self.roomNr)
            self.sio.emit("message", {'text': 'CHECKMATE'}, room=self.roomNr)
            self.gameFinished = True

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

        # repetition
        if self.board.is_repetition():
            self.sio.emit("blockMovement", room=self.roomNr)
            self.sio.emit("message", {'text': 'REPETITION'}, room=self.roomNr)
            self.gameFinished = True

        # agreement 
        # one player asks for draw

    def repeatMove(self,lastMoveSid):
        # print("repeatMove: ", self.getLegalMoves())
        self.sio.emit("unblockMovement", self.getLegalMoves(), to=lastMoveSid)

    def check(self):
        return self.board.outcome()