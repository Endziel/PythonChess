// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { DragControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/DragControls.js';
// import  BuildBoard  from '/projekt/public/buildBoard.js';

import * as THREE from '/projekt/three/build/three.module.js';
import { OrbitControls } from './../three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from './../three/examples/jsm/controls/DragControls.js';
import  BuildBoard  from './buildBoard.js';

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
    #isTimerPaused
    #timeLeft  // in seconds
    #timerId
    #legalMoves
    #orbitControls
    // #mouse
    // #raycaster
    // #mouseClick
    // #draggable

    constructor(myPieces, socket, legalMoves, testDocument = undefined) {
        if(myPieces == "white"){
            this.#camera = this.#createCamera(20, 12.9);
        }else{
            this.#camera = this.#createCamera(20, -12.9);
        }

        this.#myPieces = myPieces;
        this.#legalMoves = legalMoves;

        this.#socket = socket;

        this.#scene = new THREE.Scene();
        this.#board =  new BuildBoard();
        this.#container =  this.#board.buildBoardWithPieces();
        this.#renderer = this.#setRenderer();
        
        this.#scene.add(this.#container);

        this.#addBackground();
        this.#addAmbientLight(0.45, 0xFFFFFF);
        this.#addDirectionalLight(new THREE.Vector3(30, 15, -17), 1.75, 0xFFFFFF, 50);
        this.#addControls(myPieces);
        // this.render();

        this.#addTimer();
        this.#isTimerPaused = true;
        this.#timeLeft = 120;
        

        // const axesHelper = new THREE.AxesHelper( 5 );
        //     this.scene.add( axesHelper );

        // this.#mouse = new THREE.Vector2();
        // this.#mouseClick = new THREE.Vector2();
        // this.#raycaster = new THREE.Raycaster();
        // this.#draggable = null;
        // this.#selectedPiece = null;
        window.addEventListener( 'resize', (event) => this.onWindowResize(this), false );
        // window.addEventListener('mousemove', (event) => this.onMouseMove(this, event))
        // window.addEventListener('click', (event) => this.onClick(this, event))
        
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

    get camera() {
        return this.#camera;
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

    get isTimerPaused() {
        return this.#isTimerPaused;
    }

    get timerId() {
        return this.#timerId;
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
    
    #addBackground() {
        const loader = new THREE.TextureLoader();
        loader.load('https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg' , (texture) => onLoad(texture, this));
        
        function onLoad(texture, self) {
            self.#scene.background = texture; 
        }
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
        this.#orbitControls = new OrbitControls(this.#camera,this.#renderer.domElement);
        // this.#orbitControls.maxPolarAngle = Math.PI / 6;
        // this.#orbitControls.minPolarAngle = Math.PI / 6;
        // this.#orbitControls.minDistance = 10;
        // this.#orbitControls.maxDistance = 200;
        // this.#orbitControls.mouseButtons = {
        //     LEFT: THREE.MOUSE.ROTATE,
        //     MIDDLE: THREE.MOUSE.DOLLY,
        // }

        console.log(this.#scene.children);

        this.#dragControls = new DragControls(piecesColor == "white" ? this.#board.whiteFigures : this.#board.blackFigures, this.#camera, this.#renderer.domElement);
        
        
        this.#dragControls.addEventListener('hoveron', (event) => onHoverOn(event));

        this.#dragControls.addEventListener('hoveroff', (event) => onHoverOff(event));

        this.#dragControls.addEventListener( 'dragstart', (event) => onDragStart(event, this, this.#orbitControls) );

        // console.log(Board.SQUARE_POSITIONS_MAP);
        
        this.#dragControls.addEventListener ( 'drag', (event) => onDrag(event, this));
        
        this.#dragControls.addEventListener( 'dragend', (event) => onDragEnd(event, this, this.#orbitControls));

        this.#orbitControls.update();
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
            // const axesHelper = new THREE.AxesHelper( 30 );
            // event.object.add( axesHelper );

            orbitControls.enabled = false;
    
            event.object.material.color.set("#ccc");
            // console.log(event.object);
    
            console.log(self.renderer);
            self.renderer.domElement.classList.remove("cursor-on");
            self.renderer.domElement.classList.add("cursor-none");
       
        }
    
        function onDrag(event, self) {
            
            event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
            console.log("EVENT OBJECT", event.object)
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

                for (let [position, color] of Object.entries(self.#board.SQUARE_COLORS_MAP)) {
                    // if (position != closestField) {
                    //     self.container.getObjectByName(position).material.color.set(color);
                    // }
                    self.container.getObjectByName(position).material.color.set(color);
                }
    
                for (let move of self.#legalMoves) {
                    // console.log("MOVEdqwdqwdqwd", move)
                    if (move.slice(0, 2) == event.object.parent.parent.name) {
                        self.container.getObjectByName(move.slice(2, 4)).material.color.set(0x00ff00);
                    }
                }
    
                
                console.log('closest field', closestField)
                self.container.getObjectByName(closestField).material.color.set(0x0000ff);

                // if (previousField == undefined) {
                //     previousField = closestField;
                //     previousFieldColor = self.#container.getObjectByName(previousField).material.color.clone();
    
                //     currentField = closestField;
                //     // currentFieldColor = container.getObjectByName(currentField).material.color.clone();
    
                //     console.log("pierwsze ustawwienia");
                // }
    
                // currentField = closestField;
                
                // if (currentField != previousField) {
                //     console.log("powrot");
                //     console.log(previousFieldColor);
                //     self.container.getObjectByName(previousField).material.color.set(previousFieldColor);
                //     previousField = currentField;
                //     previousFieldColor = self.#container.getObjectByName(previousField).material.color.clone();
                //     console.log("powrot");
    
    
                // }
    
                // if (self.#container.getObjectByName(currentField).material.color.getHexString() != '0000ff' ){
                    
                //     // currentFieldColor =  container.getObjectByName(closestField).material.color.clone();
                //     self.container.getObjectByName(closestField).material.color.set("#00f");
                //     console.log("w ifie");
    
                // }
        }
    
        function onDragEnd(event, self, orbitControls) {
            if (self.isTimerPaused) {
                self.unpauseTimer();
            }
            self.blockPieces();
            orbitControls.enabled = true;
    
            event.object.material.color.set("#ffffff");
            const objectInWorldVectorAfterMove = new THREE.Vector3( 0, 0, 0 );
            event.object.getWorldPosition(objectInWorldVectorAfterMove);
            const objectInWorldVectorDifferentFromMove = new THREE.Vector3( 0, 0, 0 );
            objectInWorldVectorDifferentFromMove.subVectors(objectInWorldVectorAfterMove, objectInWorldVectorBeforeMove);


            
            for (let [position, color] of Object.entries(self.#board.SQUARE_COLORS_MAP)) {
                // if (position != closestField) {
                //     self.container.getObjectByName(position).material.color.set(color);
                // }
                self.container.getObjectByName(position).material.color.set(color);
            }

            // self.container.getObjectByName(closestField).material.color.set(previousFieldColor);
            
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

    #addTimer() {
        let timerContainer = document.createElement("div");
        timerContainer.classList.add("timer-container");
        document.body.appendChild(timerContainer);
    }
    render() {
        // this.resetHover(this);
        // this.hoverPieces(this);
        // this.dragObject(this);
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.#scene, this.#camera);
    }

    blockPieces() {
        this.#dragControls.deactivate();
    }

    unblockPieces(legalMoves) {
        this.#dragControls.activate();
        this.#legalMoves = legalMoves;
        console.log(legalMoves)
        
    }

    async changePiecePosition(previous, current) {
        this.scene.updateMatrixWorld();
        let piece = this.container.getObjectByName(previous).children[0];
        
        console.log("changePiecePosition->dragControls: ", this.#dragControls.getObjects());
        
        const vector = new THREE.Vector3( 0, 0, 0 );

        this.container.getObjectByName(previous).getWorldPosition(vector);

        const diffVectorsMovePiece = new THREE.Vector3( 0, 0, 0 );
        diffVectorsMovePiece.subVectors(
            this.container.getObjectByName(current).getWorldPosition(new THREE.Vector3(0,0,0)),
            this.container.getObjectByName(previous).getWorldPosition(new THREE.Vector3(0,0,0))
         );

         console.log(diffVectorsMovePiece);

        piece.position.copy(diffVectorsMovePiece);
        
        this.container.getObjectByName(current).add(piece);
        piece.position.set(0, 0, 0);

        // this.container.getObjectByName(current).add(this.container.getObjectByName(previous).children[0]);
        console.log("previous: ", this.container.getObjectByName(previous).children[0], "current: ", this.container.getObjectByName(current).children[0]);
        
        console.log(this.scene);
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
        buttonsContainer.classList.add("pieceChoiceContainer");
        
        
        for (let [name, value] of Object.entries(buttons)) {
            let button = document.createElement("button");
            button.innerHTML = name;
            button.setAttribute("value", value+"-"+this.myPieces);
            button.classList.add("pieceChoice");
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
            document.querySelector(".pieceChoiceContainer").remove();
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
        let drawButtonsContainer = document.createElement("div");
        drawButtonsContainer.classList.add("draw-buttons-container");

        let buttonAccept = document.createElement("button");
        buttonAccept.innerHTML = "ACCEPT DRAW";
        buttonAccept.setAttribute("id", "btn-draw-accept");

        let buttonDecline = document.createElement("button");
        buttonDecline.innerHTML = "DECLINE DRAW";
        buttonDecline.setAttribute("id", "btn-draw-decline");

        buttonAccept.onclick = () => {
            drawButtonsContainer.remove()
            this.socket.emit('draw', true)
        }

        buttonDecline.onclick = () => {
            drawButtonsContainer.remove()
            this.socket.emit('draw', false)
        }

        drawButtonsContainer.appendChild(buttonAccept);
        drawButtonsContainer.appendChild(buttonDecline);
        document.body.appendChild(drawButtonsContainer);
    }

    startTimer() {
        this.displayTime(this);
        this.#timerId = setInterval(() => this.calcTime(this), 1000); 
    }

    calcTime(self) {
        if (!self.isTimerPaused) {
            if (self.#timeLeft <= 0) {
                clearInterval(self.timerId);
                this.displayTime(this);
                self.socket.emit("timeEnd");
            }

            // console.log("calcTime")
            // console.log(self.#timeLeft)
            this.displayTime(this);
          
            // If the count down is finished, write some text
            
    
            self.#timeLeft -= 1;
        }
        
    }

    displayTime(self) {
        var hours = Math.floor(self.#timeLeft  / 3600);
        var minutes = Math.floor(self.#timeLeft  % 3600 / 60);
        var seconds = Math.floor(self.#timeLeft  % 3600 % 60);
        
        // Display the result in the element with id="demo"
        document.querySelector(".timer-container").innerHTML = 
            (hours < 10 ? "0" + hours : hours )+ ":" 
            + (minutes < 10 ? "0" + minutes : minutes ) + ":" 
            + (seconds < 10 ? "0" + seconds : seconds );
    }

    pauseTimer() {
        this.#isTimerPaused = true;
    }

    unpauseTimer() {
        this.#isTimerPaused = false;
    }

    resetProposal() {
        let drawButtonsContainer = document.createElement("div");
        drawButtonsContainer.classList.add("reset-buttons-container");

        let buttonAccept = document.createElement("button");
        buttonAccept.innerHTML = "ACCEPT RESTART";
        buttonAccept.setAttribute("id", "btn-reset-accept");

        let buttonDecline = document.createElement("button");
        buttonDecline.innerHTML = "DECLINE RESTART";
        buttonDecline.setAttribute("id", "btn-reset-decline");

        buttonAccept.onclick = () => {
            drawButtonsContainer.remove()
            this.socket.emit('reset', true)
        }

        buttonDecline.onclick = () => {
            drawButtonsContainer.remove()
            this.socket.emit('reset', false)
        }

        drawButtonsContainer.appendChild(buttonAccept);
        drawButtonsContainer.appendChild(buttonDecline);
        document.body.appendChild(drawButtonsContainer);
    }

    onWindowResize(self){

        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();

        self.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    testfun(number){
        return number + 1;
    }

} 
export default ThreeJsView;
