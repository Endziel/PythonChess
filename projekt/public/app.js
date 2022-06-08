import  ThreeJsView  from '/projekt/public/threeJsViewRs.js';

export class AppClient {

    socket = io();

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


        document.querySelector('#btn-send').onclick = () => {
    
            const text = document.querySelector('input').value;
            this.socket.emit('message', text);
            document.querySelector('input').value = "";
            
        }

        document.querySelector('#btn-resign').onclick = () => {
            this.socket.emit('resign')
            
        }

        document.querySelector('#btn-draw').onclick = () => {
            this.socket.emit('drawProposal')
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




