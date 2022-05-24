import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/DragControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
// import {BuildBoard} from './buildBoard.js';
// import "./buildBoard.js";
import  BuildBoard  from '/projekt/public/buildBoard.js';

var width = 1376;
    var height = 768;
    var aspectRatio = width / height;
    var fov = 65;
    var nearClip = 0.1;
    var farClip = 2000;
    var SQUARE_MESH_IDS = {};
    var figures = [];

    var SQUARE_SIZE = 2;
    // var cameraPosition = new THREE.Vector3(0, -100, 0);
    var cameraPosition = new THREE.Vector3(0, 12.9, 12.9);

    var cameraTarget = new THREE.Vector3(-100, -100, -100);
    var lightPosition = new THREE.Vector3(30, 15, -17);

    var ambientLightIntensity = 0.45;
    var directionalLightIntensity = 1.75;

    var clearColour = 0x404040;
    var ambientLightColour = 0xFFFFFF;
    var directionalLightColour = 0xFFFFFF;

    var shadowFrustum = 50;
    var shadowMapWidth = 1024;
    var shadowMapHeight = 1024;

    // create scene and a object3D container to store all the mesh items
    var scene = new THREE.Scene();
    var container = new THREE.Object3D();
    container.name = "ChessBoard";
    // initialise the camera
    var camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearClip, farClip);
    camera.position.copy(cameraPosition);
    // camera.lookAt(cameraTarget);
    camera.lookAt(new THREE.Vector3(0, -3, 0));

    


    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(clearColour, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // document.body.appendChild(renderer.domElement);
    // document.body.
    let element = document.getElementById('board');
    
    element.appendChild(renderer.domElement);
    // var light = new THREE.PointLight( 0xffffff, 0.4 );
    // camera.add( light );

    // add an ambient and directional light
    var ambientLight = new THREE.AmbientLight(ambientLightColour, ambientLightIntensity);
    var directionalLight = new THREE.DirectionalLight(directionalLightColour, directionalLightIntensity);
    directionalLight.position.copy(lightPosition);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.right = shadowFrustum;
    directionalLight.shadow.camera.left = -shadowFrustum;
    directionalLight.shadow.camera.top = shadowFrustum;
    directionalLight.shadow.camera.bottom = -shadowFrustum;
    directionalLight.shadow.mapSize.width = shadowMapWidth;
    directionalLight.shadow.mapSize.height = shadowMapHeight;
    
    scene.add(ambientLight);
    scene.add(directionalLight);
    
    init();

function init() {
    var Board = new BuildBoard();
    var container =  Board.buildBoardWithPieces();
    scene.add(container);

    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );


    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    
    var Orbcontrols = new OrbitControls(camera,renderer.domElement);
    // Orbcontrols.maxPolarAngle = Math.PI / 6;
    // Orbcontrols.minPolarAngle = Math.PI / 6;
    // Orbcontrols.minDistance = 10;
    // Orbcontrols.maxDistance = 200;
    // Orbcontrols.mouseButtons = {
    //     LEFT: THREE.MOUSE.ROTATE,
    //     MIDDLE: THREE.MOUSE.DOLLY,
    // }

    console.log(scene.children);

  
    const controls = new DragControls(Board.figures, camera, renderer.domElement);
    
    controls.addEventListener('hoveron', function(event) {
        event.object.material.color.set("#999");
    });

    controls.addEventListener('hoveroff', function(event) {
        event.object.material.color.set('#fff');
    });

    let currentField;
    let currentFieldColor;
    let previousFieldColor;
    let previousField;
    let closestField;
    controls.addEventListener( 'dragstart', function ( event ) {
        Orbcontrols.enabled = false;

        event.object.material.color.set("#ccc");
        // console.log(event.object);

        renderer.domElement.classList.remove("cursor-on");
        renderer.domElement.classList.add("cursor-none");
        

        let fieldPosition = new THREE.Vector3( 0, 0, 0 );
        container.getObjectByName("a1").getWorldPosition(fieldPosition);
        // console.log(fieldPosition);

    } );

    // console.log(Board.SQUARE_POSITIONS_MAP);
    
    controls.addEventListener ( 'drag', function( event ){
        event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
        scene.updateMatrixWorld();
        let positions = Board.SQUARE_POSITIONS_MAP;
        
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
            previousFieldColor = container.getObjectByName(previousField).material.color.clone();
            // console.log(previousFieldColor);

            currentField = closestField;
            currentFieldColor = container.getObjectByName(currentField).material.color.clone();
            // console.log(currentFieldColor);

            console.log("pierwsze ustawwienia");
        }

        currentField = closestField;
        // console.log(container.getObjectByName(currentField).material.color.getHexString());

        
        // currentFieldColor =  container.getObjectByName(closestField).material.color;

        // container.getObjectByName(closestField).material.color.set("#eee");
        if (currentField != previousField) {
            console.log("powrot");
            console.log(previousFieldColor);
            container.getObjectByName(previousField).material.color.set(previousFieldColor);
            previousField = currentField;
            previousFieldColor = container.getObjectByName(previousField).material.color.clone();
            console.log("powrot");


        }

        if (container.getObjectByName(currentField).material.color.getHexString() != '0000ff' ){
            
            currentFieldColor =  container.getObjectByName(closestField).material.color.clone();
            container.getObjectByName(closestField).material.color.set("#00f");
            console.log("w ifie");

        }
 
    });
    
    controls.addEventListener( 'dragend', function ( event ) {
        Orbcontrols.enabled = true;

        event.object.material.color.set("#ffffff");
        const vector = new THREE.Vector3( 0, 0, 0 );
        event.object.getWorldPosition(vector);
        // console.log(vector);
        container.getObjectByName(closestField).material.color.set(previousFieldColor);
        event.object.parent
        renderer.domElement.classList.add("cursor-on");
        renderer.domElement.classList.remove("cursor-none");
    } );

    Orbcontrols.update();

    render();
}


function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}