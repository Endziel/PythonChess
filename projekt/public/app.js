import  ThreeJsView  from '/projekt/public/threeJsViewRs.js';

export class AppClient {

    socket = io();

    Game 

    constructor() {
        this.init();
    }

    init() {
        this.socket.on('message', data => {

            const el = document.createElement('p');
            el.innerHTML = data['text'];
            

            if (data['from'] == "me") {
                el.classList.add("my-message");
            } else if (data['from'] == "opponent") {
                el.classList.add("opponent-message");
            } else {
                el.classList.add("game-info-message");
            }
    
            let container = document.querySelector('.messages-container');
            container.appendChild(el);
            container.scrollTop = container.scrollHeight;
        });
    
        this.socket.on('startGameWhite', data => {
            let elements = document.querySelectorAll( 'body > *:not(.chat-container):not(#board)' );
            for (let i = 0; i < elements.length; i++) {
                elements[i].remove()
            }
            if (document.querySelector("#board canvas")) {
                document.querySelector("#board canvas").remove()
            }

            
            this.Game = new ThreeJsView(data['text'], this.socket, data['legalMoves']);
            this.Game.render();
            this.Game.startTimer();
            // this.Game.unpauseTimer();
            
            const el = document.createElement('p');
            el.innerHTML = data['text'];
            el.classList.add("game-info-message");
            document.querySelector('.messages-container').appendChild(el);
    
        });
    
    
        this.socket.on('startGameBlack', data => {
            let elements = document.querySelectorAll( 'body > *:not(.chat-container):not(#board)' );
            for (let i = 0; i < elements.length; i++) {
                elements[i].remove()
            }
            if (document.querySelector("#board canvas")) {
                document.querySelector("#board canvas").remove()
            }
            this.Game = new ThreeJsView(data['text'], this.socket, data['legalMoves']);
            this.Game.blockPieces();
            this.Game.render();
            this.Game.startTimer();

            const el = document.createElement('p');
            el.innerHTML = data['text'];
            el.classList.add("game-info-message");
            document.querySelector('.messages-container').appendChild(el)
        });

        this.socket.on('clearDocument', () => {
            
        });
    
        this.socket.on('blockMovement', () => {
            this.Game.blockPieces();
            this.Game.pauseTimer();
        });

        this.socket.on('unblockMovement', (legalMoves) => {
            this.Game.unblockPieces(legalMoves);
            this.Game.unpauseTimer();
        });
        
        this.socket.on('movePiece', piecePosition => {
            console.log("movePiece");
            let pieceStart = piecePosition.slice(0,2);
            let pieceEnd = piecePosition.slice(2, 4);
            
            this.Game.changePiecePosition(pieceStart, pieceEnd);
        });
    
        this.socket.on('removePiece', piecePosition => {
            console.log("removePiece");
            
            this.Game.removePiece(piecePosition);
        });

        this.socket.on('promotePiece', move => {
            console.log("promotePiece");
            
            this.Game.choosePromotionPiece(move);
        });

        this.socket.on('addPromotedPiece', pieceData => {
            console.log("addPromotedPiece");

            let position = pieceData['position'];
            let pieceSymbol = pieceData['pieceSymbol'];
            let color = pieceData['color'];
            this.Game.addPromotedPiece(position, pieceSymbol, color);
        })
    
        this.socket.on('drawProposal', () => {
            console.log("drawProposal");
            this.Game.drawProposal();
        })

        this.socket.on('resetProposal', () => {
            console.log("resetProposal");
            this.Game.resetProposal();
        })


        document.querySelector('input').onkeyup = (e) => {
    
            const text = document.querySelector('input').value;
            if (e.key === "Enter") {
                if (text.trim() != "") {
                    this.socket.emit('message', text);
                }
                document.querySelector('input').value = "";
            }
        }

        document.querySelector('#btn-resign').onclick = () => {
            this.socket.emit('resign')
            
        }

        document.querySelector('#btn-draw').onclick = () => {
            this.socket.emit('drawProposal')
        }

        document.querySelector('#btn-reset').onclick = () => {
            this.socket.emit('resetProposal')
          
        }
        // document.querySelector('#btn-draw-accept').onclick = () => {
        //     this.socket.emit('draw', true)
        // }

        // document.querySelector('#btn-draw-decline').onclick = () => {
        //     this.socket.emit('draw', false)
        // }


    }
    

}
export default AppClient;


let app = new AppClient();




