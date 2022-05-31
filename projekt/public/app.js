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
            // this.Game.blockPieces();
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
            // this.Game.render();
    
        });
    
        this.socket.on('updateBoard', piecePosition => {
            console.log("test");
            let pieceStart = piecePosition.split("_");
            this.Game.changePiecePosition(pieceStart[0], pieceStart[1]);
            // this.Game.render();

    
        });
    
    
    
        document.querySelector('button').onclick = () => {
    
            const text = document.querySelector('input').value;
            this.socket.emit('message', text)
            
        }
    }
    

}

let app = new AppClient();




