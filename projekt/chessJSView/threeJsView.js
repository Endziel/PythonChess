import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/DragControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
var width = 1376;
    var height = 768;
    var aspectRatio = width / height;
    var fov = 60;
    var nearClip = 0.1;
    var farClip = 2000;
    var rotateSpeed = 0.005;

    var cameraPosition = new THREE.Vector3(150, 720, 450);
    var cameraTarget = new THREE.Vector3(0, 0, 0);
    var lightPosition = new THREE.Vector3(30, 1000, -175);

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

    // initialise the camera
    var camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearClip, farClip);
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);
    
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

    // var hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0);
    // scene.add(hemiLight);
    // var spotLight = new THREE.SpotLight(0xffa95c,4);
    // spotLight.castShadow = true;

    // create renderer and attach to DOM
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(clearColour, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // document.body.appendChild(renderer.domElement);
    // document.body.
    let element = document.getElementById('board');
    
    element.appendChild(renderer.domElement);


    //movement - please calibrate these values
    var xSpeed = 0.05;
    var ySpeed = 0.05;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        
        var keyCode = event.which;
        console.log("something qdqwdqwdqw KEYCODE: " + keyCode)
        if (keyCode == 87) {
            container.rotation.x += ySpeed;
        } else if (keyCode == 83) {
            container.rotation.x -= ySpeed;
        } else if (keyCode == 65) {
            container.rotation.y -= xSpeed;
        } else if (keyCode == 68) {
            container.rotation.y += xSpeed;
        } else if (keyCode == 32) {
            container.rotation.set(0, 0, 0);
        }
        
    };

    // create loading manager to load in all our models
    var manager = new THREE.LoadingManager();
    manager.onLoad = init;

    const loader = new GLTFLoader(manager);

    // Load a glTF resource
    loader.load(    
        // resource URL
        'chessJSView/scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {

            container.add( gltf.scene );

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

    function init() {
        scene.add(container);

        console.log(scene.children)
        var figures = [];
        for (var i = 0; i < scene.getObjectByName("RootNode").children.length - 1; i++) {
            figures.push(scene.getObjectByName("RootNode").children[i]);
        }
        
        var Orbcontrols = new OrbitControls(camera,renderer.domElement);

        // Orbcontrols.mouseButtons = {
        //     RIGHT: THREE.MOUSE.ROTATE,
        //     MIDDLE: THREE.MOUSE.DOLLY
            
        // };
        
        const controls = new DragControls(figures, camera, renderer.domElement);
        
        controls.addEventListener( 'dragstart', function ( event ) {
            Orbcontrols.enabled = false;
            console.log(renderer.domElement)

            event.object.material.emissive.set( 0xaaaaaa );
            // console.log(event.object);
            renderer.domElement.classList.remove("cursor-on");
            renderer.domElement.classList.add("cursor-none");

        } );

        controls.addEventListener ( 'drag', function( event ){
            event.object.position.z = 0; // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
           
        })
        
        controls.addEventListener( 'dragend', function ( event ) {
            Orbcontrols.enabled = true;

            event.object.material.emissive.set( 0x000000 );
            console.log(event.object.position);

            renderer.domElement.classList.add("cursor-on");
            renderer.domElement.classList.remove("cursor-none");
            scene.getObjectByName("RootNode").children[32].children[2].visible = false;
        } );

        // controls.addEventListener('click',function (event){
        //     event.object.location.position.x += 100;
        //     renderer.domElement.classList.add("cursor-none");
        // } );

        Orbcontrols.update();

        render();
    }

    function render() {
        // container.rotation.y += rotateSpeed;
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function degreeToRad(deg) {
        return deg * (Math.PI / 180);
    }