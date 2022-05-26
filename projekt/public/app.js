import  ThreeJsView  from '/projekt/public/threeJsViewRs.js';

const socket = io('ws://localhost:5555');

const Game =  new ThreeJsView(socket); // TODO: 


socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});

socket.on('startGameWhite', text => {
    // const Game = new ThreeJsView(text, socket);
    // Game.blockPieces();
    Game.render();

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)
    // Game.render();

});


socket.on('startGameBlack', text => {
    // Game = new ThreeJsView(text,socket);
    // Game.blockPieces();
    Game.render();

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)
    // Game.render();

});

socket.on('updateBoard', piecePosition => {
    console.log("test");
    let pieceStart = piecePosition.split("_");
    // Game.changePiecePosition(pieceStart[0], pieceStart[1]);

});



document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
    
}




