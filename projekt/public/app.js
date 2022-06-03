import  ThreeJsView  from '/projekt/public/threeJsViewRs.js';

class AppClient {
    socket = io('ws://localhost:5555');

    Game 

    constructor() {
        this.init();
    }

    init() {
        this.socket.on('message', text => {

            const el = document.createElement('li');
            el.innerHTML = text;
            document.querySelector('ul').appendChild(el)
    
        });
    
        this.socket.on('startGameWhite', text => {
            this.Game = new ThreeJsView(text, this.socket);
            this.Game.render();
    
            const el = document.createElement('li');
            el.innerHTML = text;
            document.querySelector('ul').appendChild(el)
            // this.Game.render();
    
        });
    
    
        this.socket.on('startGameBlack', text => {
            this.Game = new ThreeJsView(text, this.socket);
            this.Game.blockPieces();
            this.Game.render();
    
            const el = document.createElement('li');
            el.innerHTML = text;
            document.querySelector('ul').appendChild(el)
        });
    
        this.socket.on('blockMovement', () => {
            this.Game.blockPieces();
        });

        this.socket.on('unblockMovement', () => {
            this.Game.unblockPieces();
        });
        
        this.socket.on('movePiece', piecePosition => {
            console.log("movePiece");
            let pieceStart = piecePosition.slice(0,2);
            let pieceEnd = piecePosition.slice(2);
            
            this.Game.changePiecePosition(pieceStart, pieceEnd);
        });
    
        this.socket.on('removePiece', piecePosition => {
            console.log("removePiece");
            
            this.Game.removePiece(piecePosition);
        });
    
    
        document.querySelector('button').onclick = () => {
    
            const text = document.querySelector('input').value;
            this.socket.emit('message', text)
            
        }
    }
    

}

let app = new AppClient();




