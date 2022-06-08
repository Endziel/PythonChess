// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { DragControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/DragControls.js';
// import  BuildBoard  from '/projekt/public/buildBoard.js';

import * as THREE from '../../projekt/three/build/three.module.js';
import { OrbitControls } from '../../projekt/three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from '../../projekt/three/examples/jsm/controls/DragControls.js';
import  BuildBoard  from '../../projekt/public/buildBoard.js';

export class ThreeJsView {
    #width = window.innerWidth;
    #height = window.innerHeight;
    #aspectRatio = this.#width / this.#height;
    // #fov = 65;
    // #nearClip = 0.1;
    // #farClip = 2000;
    #camera;
    #scene;
    #board;
    #container;
    #renderer;
    #dragControls
    #socket
    #myPieces
    // #orbitControls
    

    constructor(myPieces, socket, testDocument = undefined) {
        if(myPieces == "white"){
            this.#camera = this.#createCamera(12.9, 12.9);
        }else{
            this.#camera = this.#createCamera(12.9, -12.9);
        }

        this.#myPieces = myPieces

        // if (testDocument != undefined) {
        //     document = testDocument;
        // }

        this.#socket = socket;

        this.#scene = new THREE.Scene();
        this.#board =  new BuildBoard();
        this.#container =  this.#board.buildBoardWithPieces();
        this.#renderer = this.#setRenderer();
        
        this.#scene.add(this.#container);

        this.#addAmbientLight(0.45, 0xFFFFFF);
        this.#addDirectionalLight(new THREE.Vector3(30, 15, -17), 1.75, 0xFFFFFF, 50);
        this.#addControls(myPieces);
        // this.render();

        const axesHelper = new THREE.AxesHelper( 5 );
            this.scene.add( axesHelper );

    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    get renderer() {
        return this.#renderer;
    }

    get container() {
        return this.#container;
    }

    get scene() {
        return this.#scene;
    }

    get socket() {
        return this.#socket;
    }

    get myPieces() {
        return this.#myPieces;
    }


    #createCamera(positionY, positionZ){
        var fov = 65;
        var nearClip = 0.1;
        var farClip = 2000;
        // position (0,12.9,12.9)
        
        var cameraPosition = new THREE.Vector3(0, positionY, positionZ);
        //target (-100,-100,-100)
        var camera = new THREE.PerspectiveCamera(fov, this.#aspectRatio, nearClip, farClip);
        camera.position.copy(cameraPosition);
        // // camera.lookAt(cameraTarget);
        // camera.lookAt(new THREE.Vector3(0, -3, 0));

        console.log("createCamera");
        return camera;

    }
    
    #setRenderer() {
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(this.#width, this.#height);
        renderer.setClearColor(0x404040, 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        
        let element = document.getElementById('board');
        element.appendChild(renderer.domElement);

        console.log("setRenderer");
        return renderer;
    }
    #addAmbientLight(intensity, color) {
        var ambientLight = new THREE.AmbientLight(color, intensity);

        console.log("addAmbientLight");
        this.#scene.add(ambientLight)
        
    }
    #addDirectionalLight(position, intensity, color, shadowFrustum, shadowMapWidth=1024, shadowMapHeight=1024) {
        var directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.copy(position);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.right = shadowFrustum;
        directionalLight.shadow.camera.left = -shadowFrustum;
        directionalLight.shadow.camera.top = shadowFrustum;
        directionalLight.shadow.camera.bottom = -shadowFrustum;
        directionalLight.shadow.mapSize.width = shadowMapWidth;
        directionalLight.shadow.mapSize.height = shadowMapHeight;

        console.log("adddirectionalLight");
        this.#scene.add(directionalLight)
    }

    #addControls(piecesColor) {
        var Orbcontrols = new OrbitControls(this.#camera,this.#renderer.domElement);
        // Orbcontrols.maxPolarAngle = Math.PI / 6;
        // Orbcontrols.minPolarAngle = Math.PI / 6;
        // Orbcontrols.minDistance = 10;
        // Orbcontrols.maxDistance = 200;
        // Orbcontrols.mouseButtons = {
        //     LEFT: THREE.MOUSE.ROTATE,
        //     MIDDLE: THREE.MOUSE.DOLLY,
        // }

        console.log(this.#scene.children);

        this.#dragControls = new DragControls(piecesColor == "white" ? this.#board.whiteFigures : this.#board.blackFigures, this.#camera, this.#renderer.domElement);
        
        
        this.#dragControls.addEventListener('hoveron', (event) => onHoverOn(event));

        this.#dragControls.addEventListener('hoveroff', (event) => onHoverOff(event));

        this.#dragControls.addEventListener( 'dragstart', (event) => onDragStart(event, this, Orbcontrols) );

        // console.log(Board.SQUARE_POSITIONS_MAP);
        
        this.#dragControls.addEventListener ( 'drag', (event) => onDrag(event, this));
        
        this.#dragControls.addEventListener( 'dragend', (event) => onDragEnd(event, this, Orbcontrols));

        Orbcontrols.update();
        console.log("addControls");


        let currentField;
        let previousFieldColor;
        let previousField;
        let closestField;
        let objectInWorldVectorBeforeMove = new THREE.Vector3( 0, 0, 0 );

        

        function onHoverOff(event) {
            event.object.material.color.set("#fff");
        }

        function onHoverOn(event) {
            event.object.material.color.set("#999");
        }

        function onDragStart(event, self, orbitControls) {
            event.object.getWorldPosition(objectInWorldVectorBeforeMove);
            const axesHelper = new THREE.AxesHelper( 30 );
            event.object.add( axesHelper );

            orbitControls.enabled = false;
    
            event.object.material.color.set("#ccc");
            // console.log(event.object);
    
            console.log(self.renderer);
            self.renderer.domElement.classList.remove("cursor-on");
            self.renderer.domElement.classList.add("cursor-none");
       
        }
    
        function onDrag(event, self) {
            event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
            self.scene.updateMatrixWorld();
                let positions = self.#board.SQUARE_POSITIONS_MAP;
                
                let piecePosition = new THREE.Vector3( 0, 0, 0 );
                event.object.getWorldPosition(piecePosition);
                // console.log(piecePosition);
                // let worldPosition = event.object.localToWorld(piecePosition);
                let minDistance = 10000;
                
                for (let [key, coords] of Object.entries(positions)) {
                    let distance = Math.sqrt(Math.pow(piecePosition.x-coords[0], 2) + Math.pow(piecePosition.z-coords[2], 2));
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestField = key;
                    }
                }
    
    
                if (previousField == undefined) {
                    previousField = closestField;
                    previousFieldColor = self.#container.getObjectByName(previousField).material.color.clone();
    
                    currentField = closestField;
                    // currentFieldColor = container.getObjectByName(currentField).material.color.clone();
    
                    console.log("pierwsze ustawwienia");
                }
    
                currentField = closestField;
                
                if (currentField != previousField) {
                    console.log("powrot");
                    console.log(previousFieldColor);
                    self.container.getObjectByName(previousField).material.color.set(previousFieldColor);
                    previousField = currentField;
                    previousFieldColor = self.#container.getObjectByName(previousField).material.color.clone();
                    console.log("powrot");
    
    
                }
    
                if (self.#container.getObjectByName(currentField).material.color.getHexString() != '0000ff' ){
                    
                    // currentFieldColor =  container.getObjectByName(closestField).material.color.clone();
                    self.container.getObjectByName(closestField).material.color.set("#00f");
                    console.log("w ifie");
    
                }
        }
    
        function onDragEnd(event, self, orbitControls) {
            self.blockPieces();
            orbitControls.enabled = true;
    
            event.object.material.color.set("#ffffff");
            const objectInWorldVectorAfterMove = new THREE.Vector3( 0, 0, 0 );
            event.object.getWorldPosition(objectInWorldVectorAfterMove);
            const objectInWorldVectorDifferentFromMove = new THREE.Vector3( 0, 0, 0 );
            objectInWorldVectorDifferentFromMove.subVectors(objectInWorldVectorAfterMove, objectInWorldVectorBeforeMove);


            
            

            self.container.getObjectByName(closestField).material.color.set(previousFieldColor);
            
            self.renderer.domElement.classList.add("cursor-on");
            self.renderer.domElement.classList.remove("cursor-none");
            
            let pieceStart = event.object.parent.parent.name;
            let pieceEnd = closestField;
            console.log("vector poprzednio: ", objectInWorldVectorBeforeMove);
            console.log("vector ppotem: ", objectInWorldVectorAfterMove);
            console.log("róznica ", objectInWorldVectorDifferentFromMove);


            


            event.object.position.set(0,0,0);
            
            
            // console.log(self.socket);
            // if (pieceStart == pieceEnd) return;

            self.socket.emit("endTurn", pieceStart+pieceEnd);  
        }
        
    }
    render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.#scene, this.#camera);
    }

    blockPieces() {
        this.#dragControls.deactivate();
    }

    unblockPieces() {
        // this.#dragControls.enabled = true;
        this.#dragControls.activate();
    }

    async changePiecePosition(previous, current) {
        // if (this.container.getObjectByName(current).children){
        //     this.container.getObjectByName(current).children[0].remove;
        // }
        // x: 5, y: -0.25, z: 
        this.scene.updateMatrixWorld();
        let piece = this.container.getObjectByName(previous).children[0];
        
        console.log("changePiecePosition->dragControls: ", this.#dragControls.getObjects());
        // this.scene.attach(piece);
        // await this.sleep(1000);
        // console.log("test1");
        
        const vector = new THREE.Vector3( 0, 0, 0 );
        // await this.sleep(1000);
        // console.log("test2");

        this.container.getObjectByName(previous).getWorldPosition(vector);

        const diffVectorsMovePiece = new THREE.Vector3( 0, 0, 0 );
        diffVectorsMovePiece.subVectors(
            this.container.getObjectByName(current).getWorldPosition(new THREE.Vector3(0,0,0)),
            this.container.getObjectByName(previous).getWorldPosition(new THREE.Vector3(0,0,0))
         );

         console.log(diffVectorsMovePiece);


        

        // console.log(vector.x, vector.y, vector.z);
        // console.log(piece.position.distanceTo(vector));
        piece.position.copy(diffVectorsMovePiece);
        

        // await this.sleep(1000);
        // console.log("test3");
        
        this.container.getObjectByName(current).add(piece);
        piece.position.set(0, 0, 0);

        
        // const vector = new THREE.Vector3( 0, 0, 0 );
        // this.container.getObjectByName(current).getWorldPosition(vector);
        // console.log(vector);
        
        // let piece = this.container.getObjectByName(previous).children[0];
        // this.scene.attach(piece);
        
        // piece.position.set(vector.x, vector.y, vector.z);

        // this.container.getObjectByName(current).attach(piece);


        // this.container.getObjectByName(current).add(this.container.getObjectByName(previous).children[0]);
        console.log("previous: ", this.container.getObjectByName(previous).children[0], "current: ", this.container.getObjectByName(current).children[0]);
        
        // const vector2 = this.container.getObjectByName(current).children[0].worldToLocal(vector);
        // const vector = new THREE.Vector3( 0, 0, 0 );
        // this.container.getObjectByName(current).getWorldPosition(vector);
        // console.log(vector2);
        console.log(this.scene);
        // this.container.getObjectByName(current).children[0].position.set(vector2.x, vector2.y, vector2.z);
        // this.container.getObjectByName(previous).children[0].parent = undefined;

        

    }

    choosePromotionPiece(move) {
        let canvas = document.querySelector("canvas");
        let buttons = {
            "Queen": 'q',
            "Rook": 'r',
            "Knight": 'n',
            "Bishop": 'b'
        }
        
        let buttonsContainer = document.createElement("div");
        buttonsContainer.style.position = 'absolute';
        
        
        for (let [name, value] of Object.entries(buttons)) {
            let button = document.createElement("button");
            button.innerHTML = name;
            button.value = value;
            button.addEventListener("click", (event) => pickPromotionPiece(event, this, move))
            buttonsContainer.appendChild(button);
        }
        
        buttonsContainer.style.left = '50%';
        buttonsContainer.style.top = '0';
        buttonsContainer.style.transform = 'translate(-50%, 0)';
        document.body.appendChild(buttonsContainer);

        function pickPromotionPiece(event, self, move) {
            let button = event.target
            console.log("MOVE: ", move, "BUTTON.VALUE: ", button.value);
            self.socket.emit("endPromotion", move.slice(0, 4) + button.value);
        }
    }

    async addPromotedPiece(position, pieceSymbol, color) {
        await this.#board.addPiece(position, pieceSymbol, color);

        let piece = this.container.getObjectByName(position).children[0];
        

        console.log("addPromotedPiece->dragControls: ", this.#dragControls.getObjects());
        if (this.#myPieces === color) {
            console.log("COLOR:", color);
            console.log("BEFORE DRAGCONTROL UPDATE:", this.#dragControls.getObjects());
            console.log(piece)
            this.#dragControls.getObjects().push(piece);
            console.log("AFTER DRAGCONTROL UPDATE:", this.#dragControls.getObjects());
        }
        // add to controls
    }

    removePiece(piecePosition) {
        let piece = this.container.getObjectByName(piecePosition).children[0];
    
        console.log('piece');
        console.log(piece);
        let indexInArray = this.#dragControls.getObjects().findIndex(ele => ele.uuid === piece.uuid);

        if (indexInArray != -1) {
            console.log(this.#dragControls.getObjects().splice(indexInArray,1));
        }
        
        piece.parent.remove(piece);

        // console.log(this.#dragControls.getObjects().splice(this.#dragControls.getObjects().indexOf(piece),1));
        
        
    }

    drawProposal() {
        let buttonAccept = document.createElement("button");
        buttonAccept.innerHTML = "ACCEPT DRAW";
        buttonAccept.setAttribute("id", "btn-draw-accept");

        let buttonDecline = document.createElement("button");
        buttonDecline.innerHTML = "DECLINE DRAW";
        buttonDecline.setAttribute("id", "btn-draw-decline");

        buttonAccept.onclick = () => {
            document.querySelector("#btn-draw-accept").remove();
            document.querySelector("#btn-draw-decline").remove();
            this.socket.emit('draw', true)
        }

        buttonDecline.onclick = () => {
            document.querySelector("#btn-draw-accept").remove();
            document.querySelector("#btn-draw-decline").remove();
            this.socket.emit('draw', false)
        }

        document.body.appendChild(buttonAccept);
        document.body.appendChild(buttonDecline);
    }

    testfun(number){
        return number + 1;
    }

} 
export default ThreeJsView;
// export const testfun = ThreeJsView.testfun;

// if (typeof(exports) !== 'undefined')
// {
//   module.exports = ThreeJsView;
// }



// if (typeof(exports) !== 'undefined')
// {
//   module.exports = ThreeJsView;
// }

//     // var cameraPosition = new THREE.Vector3(0, 12.9, 12.9);

//     // var cameraTarget = new THREE.Vector3(-100, -100, -100);
//     var lightPosition = new THREE.Vector3(30, 15, -17);

//     var ambientLightIntensity = 0.45;
//     var directionalLightIntensity = 1.75;

//     var clearColour = 0x404040;
//     var ambientLightColour = 0xFFFFFF;
//     var directionalLightColour = 0xFFFFFF;

//     var shadowFrustum = 50;
//     var shadowMapWidth = 1024;
//     var shadowMapHeight = 1024;


    


//     var renderer = new THREE.WebGLRenderer({antialias: true});
//     renderer.setSize(width, height);
//     renderer.setClearColor(clearColour, 1);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFShadowMap;
//     // document.body.appendChild(renderer.domElement);
//     // document.body.
//     let element = document.getElementById('board');
    
//     element.appendChild(renderer.domElement);
//     // var light = new THREE.PointLight( 0xffffff, 0.4 );
//     // camera.add( light );

    
//     init();

// function init() {
//     var Board = new BuildBoard();
//     var container =  Board.buildBoardWithPieces();
//     #scene.add(container);

//     // const axesHelper = new THREE.AxesHelper( 5 );
//     // #scene.add( axesHelper );


//     var ambientLight = new THREE.AmbientLight(0x555555);
//     #scene.add(ambientLight);

    
//     var Orbcontrols = new OrbitControls(camera,renderer.domElement);
//     // Orbcontrols.maxPolarAngle = Math.PI / 6;
//     // Orbcontrols.minPolarAngle = Math.PI / 6;
//     // Orbcontrols.minDistance = 10;
//     // Orbcontrols.maxDistance = 200;
//     // Orbcontrols.mouseButtons = {
//     //     LEFT: THREE.MOUSE.ROTATE,
//     //     MIDDLE: THREE.MOUSE.DOLLY,
//     // }

//     console.log(#scene.children);

  
//     const controls = new DragControls(Board.figures, camera, renderer.domElement);
    
    
//     controls.addEventListener('hoveron', function(event) {
//         event.object.material.color.set("#999");
//     });

//     controls.addEventListener('hoveroff', function(event) {
//         event.object.material.color.set('#fff');
//     });

//     let currentField;
//     let currentFieldColor;
//     let previousFieldColor;
//     let previousField;
//     let closestField;
//     controls.addEventListener( 'dragstart', function ( event ) {
//         Orbcontrols.enabled = false;

//         event.object.material.color.set("#ccc");
//         // console.log(event.object);

//         renderer.domElement.classList.remove("cursor-on");
//         renderer.domElement.classList.add("cursor-none");
        

//         let fieldPosition = new THREE.Vector3( 0, 0, 0 );
//         container.getObjectByName("a1").getWorldPosition(fieldPosition);
//         // console.log(fieldPosition);

//     } );

//     // console.log(Board.SQUARE_POSITIONS_MAP);
    
//     controls.addEventListener ( 'drag', function( event ){
//         event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
//         #scene.updateMatrixWorld();
//         let positions = Board.SQUARE_POSITIONS_MAP;
        
//         let piecePosition = new THREE.Vector3( 0, 0, 0 );
//         event.object.getWorldPosition(piecePosition);
//         // console.log(piecePosition);
//         // let worldPosition = event.object.localToWorld(piecePosition);
//         let minDistance = 10000;
        
//         for (let [key, coords] of Object.entries(positions)) {
//             let distance = Math.sqrt(Math.pow(piecePosition.x-coords[0], 2) + Math.pow(piecePosition.z-coords[2], 2));
//             if (distance < minDistance) {
//                 minDistance = distance;
//                 closestField = key;
//             }
//         }


//         if (previousField == undefined) {
//             previousField = closestField;
//             previousFieldColor = container.getObjectByName(previousField).material.color.clone();
//             // console.log(previousFieldColor);

//             currentField = closestField;
//             currentFieldColor = container.getObjectByName(currentField).material.color.clone();
//             // console.log(currentFieldColor);

//             console.log("pierwsze ustawwienia");
//         }

//         currentField = closestField;
//         // console.log(container.getObjectByName(currentField).material.color.getHexString());

        
//         // currentFieldColor =  container.getObjectByName(closestField).material.color;

//         // container.getObjectByName(closestField).material.color.set("#eee");
//         if (currentField != previousField) {
//             console.log("powrot");
//             console.log(previousFieldColor);
//             container.getObjectByName(previousField).material.color.set(previousFieldColor);
//             previousField = currentField;
//             previousFieldColor = container.getObjectByName(previousField).material.color.clone();
//             console.log("powrot");


//         }

//         if (container.getObjectByName(currentField).material.color.getHexString() != '0000ff' ){
            
//             currentFieldColor =  container.getObjectByName(closestField).material.color.clone();
//             container.getObjectByName(closestField).material.color.set("#00f");
//             console.log("w ifie");

//         }
 
//     });
    
//     controls.addEventListener( 'dragend', function ( event ) {
//         Orbcontrols.enabled = true;

//         event.object.material.color.set("#ffffff");
//         const vector = new THREE.Vector3( 0, 0, 0 );
//         event.object.getWorldPosition(vector);
//         // console.log(vector);
//         container.getObjectByName(closestField).material.color.set(previousFieldColor);
//         event.object.parent
//         renderer.domElement.classList.add("cursor-on");
//         renderer.domElement.classList.remove("cursor-none");
//     } );

//     Orbcontrols.update();

//     render();
// }


// function render() {
//     renderer.render(#scene, camera);
//     requestAnimationFrame(render);
// }