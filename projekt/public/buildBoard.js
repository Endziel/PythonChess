// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from '/projekt/three/build/three.module.js';
import { GLTFLoader } from '/projekt/three/examples/jsm/loaders/GLTFLoader.js';

class BuildBoard{
    #SQUARE_SIZE;
    #SQUARE_MESH_IDS = [];
    #SQUARE_POSITIONS_MAP = {};
    #blackFigures = [];
    #whiteFigures = [];
    #board;
    // #font;

    constructor(){
        this.#SQUARE_SIZE = 2;
        this.#board = this.#buildBoard();
        this.#drawBoardBottom();
    }

    get blackFigures() {
        return this.#blackFigures;
    }

    get whiteFigures() {
        return this.#whiteFigures;
    }

    get board() {
        return this.#board;
    }

    get SQUARE_POSITIONS_MAP() {
        return this.#SQUARE_POSITIONS_MAP;
    }

    buildBoardWithPieces(){
        this.#addPieces();
        console.log("buildBoardWithPieces");
        return this.#board;

    }

    #buildBoard(){
        var i;
        var container = new THREE.Object3D();
        for (i = 0; i < 8; i++) {
            var tz = 3.5 * this.#SQUARE_SIZE - (this.#SQUARE_SIZE * i);
            for (var j = 0; j < 8; j++) {
                var tx = (this.#SQUARE_SIZE * j) - 3.5 * this.#SQUARE_SIZE;
                var square = 'abcdefgh'.charAt(j) + (i + 1);
                
                this.#SQUARE_POSITIONS_MAP[square] = [tx, -1.35, tz];

                var darkSquareColor = 0x000000; ; //0xb68863;
                var darkSquareMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color(darkSquareColor)});
    
                var lightSquareColor=  0xffffff; //0xf0d9b5;
                var lightSquareMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color(lightSquareColor)});
    
                var squareMaterial = (((i % 2) === 0) ^ ((j % 2) === 0) ? lightSquareMaterial : darkSquareMaterial);
                var squareGeometry = new THREE.BoxGeometry(2, 0.3, 2);
                var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial.clone());
                squareMesh.position.set(tx, -0.25, tz);
                squareGeometry.computeFaceNormals();
                squareGeometry.computeVertexNormals();
                squareMesh.receiveShadow = true;
    
                this.#SQUARE_MESH_IDS[square] = squareMesh.id;
                squareMesh.tag = square;
                squareMesh.name = square;

                container.add(squareMesh);
            }
        }
        console.log(this.SQUARE_POSITIONS_MAP);
        
        return container;

    }

    // #addPiece(name, position){ 
    //     console.log(this.#board.getObjectByName(position));
    //     var loader = new THREE.FontLoader();

    //     const obj = JSON.parse(jsonText);
    //     this.#font =  loader.parse(obj);
        
    //     var textGeo = new THREE.TextGeometry( name, {

    //         font: this.#font,

    //         size: 1,
    //         height: 0.001,
    //         curveSegments: 12,

    //         bevelThickness: 0.3,
    //         bevelSize: 0.05,
    //         bevelEnabled: true

    //     });
        
    //     var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    
    //     console.log(textGeo);
    //     var mesh = new THREE.Mesh( textGeo, textMaterial );

    //     mesh.position.set(-0.25, 0, 0);
    //     this.#board.getObjectByName(position).add(mesh);
    //     this.#figures.push(mesh);
    // }

    async #addPieces() {
        let whitePiecesPositions = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
        let blackPiecesPositions = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
        let piecesNames = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        const loader = new GLTFLoader();

        // loading white pieces
        for (var i = 0; i < whitePiecesPositions.length; i++) {
            let url;
            if (i < whitePiecesPositions.length / 2) {
                url = '/projekt/public/objects/' + piecesNames[i] + '.glb';
            } else {
                url = '/projekt/public/objects/pawn.glb';
            }

            let gltf = await loader.loadAsync(url);
            let piece = gltf.scene.children[0];
            piece.name = i < whitePiecesPositions.length / 2 ? piecesNames[i] : "pawn" + whitePiecesPositions.length / 8;

            let pieceMesh = piece.children[0];
            pieceMesh.material.color.set('#fff');
            piece.position.setY(0);
            // piece.scale.set(10, 10, 10);
            this.#board.getObjectByName(whitePiecesPositions[i]).add(piece);
            this.#whiteFigures.push(piece);
        }

        // loading black pieces
        for (var i = 0; i < blackPiecesPositions.length; i++) {
            let url;
            if (i < blackPiecesPositions.length / 2) {
                url = '/projekt/public/objects/b_' + piecesNames[i] + '.glb';
            } else {
                url = '/projekt/public/objects/b_pawn.glb';
            }

            let gltf = await loader.loadAsync(url);
            let piece = gltf.scene.children[0];
            piece.name = i < blackPiecesPositions.length / 2 ? piecesNames[i] : "pawn" + blackPiecesPositions.length / 8;
            
            let pieceMesh = piece.children[0];
           
            piece.position.setY(0);
            pieceMesh.material.color.set('#fff');
            // piece.scale.set(10, 10, 10);

            this.#board.getObjectByName(blackPiecesPositions[i]).add(piece);
            this.#blackFigures.push(piece);
        }

    }

    async #drawBoardBottom() {
        const loader = new GLTFLoader();
        // const texture = await new THREE.TextureLoader().loadAsync('chessJSView/textures/white-marble.jpg');

        let gltf = await loader.loadAsync('/projekt/public/objects/board_bottom3.glb');
        
        let boardBottomRectangle = gltf.scene.children[0];
        boardBottomRectangle.position.setY(-1.5);
      
        this.#board.add(boardBottomRectangle);
    }
  
}
export default BuildBoard;

