// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

import * as THREE from '../projekt/three/build/three.module.js';
// import { GLTFLoader } from '../projekt/three/examples/jsm/loaders/GLTFLoader.js';
// import assert from 'node:assert';

import {assert, expect} from 'chai';


import ThreeJsView from '../projekt/public/threeJsViewRs.js';
import BuildBoard from '../projekt/public/buildBoard.js';
import testfun from '../projekt/public/threeJsViewRs.js';
import {JSDOM} from 'jsdom';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { brotliDecompressSync } from 'zlib';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dom = new JSDOM('<html><body>dwqnqwfinqofinqwoifnqowifn</body></html>');
// console.log(dom.window.document.body)
// console.log(dom.serialize());
// console.log('file://' + __dirname.slice(0, -5) + '\\projekt\\public\\index.html');

let board;


// import ThreeJsView from '../projekt/public/threeJsViewRs.js';
// var ThreeJsView = import("../projekt/public/threeJsViewRs.js");




describe('The THREE object', function() {
  it('should have a defined BasicShadowMap constant', function() {
    assert.notEqual('undefined', THREE.BasicShadowMap);
  }),

  it('should be able to construct a Vector3 with default of x=0', function() {
    const vec3 = new THREE.Vector3();
    assert.equal(0, vec3.x);
  })
})

describe('The BuildBoarClass', function(){

    it('dummy', function(){
      assert.equal(2,2);
    })
  
  let board = new BuildBoard();

    it('square size should not be undefined', function(){
      assert.notEqual(undefined, board.SQUARE_SIZE);
    })

    it('square size should be bigger then 0', function(){
      assert.isAbove(board.SQUARE_SIZE, 0);
    })

    it('should create 16 white pieces', function(done){
      board.buildBoardWithPieces();
      done();
      assert.equal(16, board.whiteFigures.length);
    })

    it('should create 16 black pieces', function(done){
      board.buildBoardWithPieces();
      done();
      assert.equal(16, board.whiteFigures.length);
    })

    it('should create 64 squares', function(done){
      board.buildBoardWithPieces();
      done();
      let counter = 0
      for (const [key, value] of board.SQUARE_POSITIONS_MAP.entries()) {
        if (board.getObjectByName(key)) {
          counter++;
        }
      }

      assert.equal(64, counter);
    })

    it('should return white queen', function(done){
      board.buildBoardWithPieces();
      done();
      assert.equal(board.board.getObjectByName('d1').children[0].name, 'queen');
    })

    it('should return black rook', function(done){
      board.buildBoardWithPieces();
      done();
      assert.equal(board.board.getObjectByName('a8').children[0].name, 'rook');
    })

    it('should return field label geometry', function(done){
      board.buildBoardWithPieces();
      done();
      const geometry = board.board.getObjectByName('c_1').geometry;
      geometry.should.be.instanceof(THREE.TextGeometry);
      
      
    })

    it('should return board bottom object', function(done){
      board.buildBoardWithPieces();
      done();
      assert.notEqual(board.board.getObjectByName('board_bottom'), undefined);
    })

    


})

// const options = {
//   resources: 'usable',
//   runScripts: 'dangerously',
//   pretendToBeVisual: true,
// };

// describe('Load HTML file', () => {
//     it('Checkboxes should be an array', (done) => {
//       JSDOM.fromFile('projekt/public/index.html', options).then(dom => {
//         console.log(dom.window.document);
//         let threejsview = new ThreeJsView('white', '', dom.window.document); 
//         // assert.equal(0, 1);
//         let board = dom.window.document.querySelector('#board');
        
//         console.log(board);
//       }).then(done, done);
//   });
// });

// describe('component.js', (done) => {
//   beforeEach(function(done) {
//     // let dom = new JSDOM('', {url: 'file://' + __dirname + './projekt/public/index.html'})
//     // console.log(dom.window.document.body);
//     // board = dom.window.document.querySelector('form');
//     // done();
// });
//   describe('checkboxes', () => {
//     it('Checkboxes should be an array', (done) => {
//       let dom = new JSDOM(undefined, {url: 'file://' + __dirname.slice(0, -5) + '\\projekt\\public\\index.html',runScripts: "dangerously",
//       resources:'usable'})
//       console.log(dom.serialize());
//       console.log("testp");
//       board = dom.window.document.querySelector('form');
//       console.log(board);
//       expect(board).to.be.a('form');
//       done();
//     });
//   });
// });

// describe('com.js', () => {
//   it('Checkboxes s', (done) => {
//     JSDOM.fromFile('projekt/public/index.html', options).then(dom => {
//       console.log(dom.serialize());
//     });
// });
// });

// const options2 = {
//   resources: 'usable',
//   runScripts: 'dangerously',
// };

// describe('com.js', () => {
//   it('Checkboxes s', (done) => {
//     JSDOM.fromFile('index.html', options2).then((dom) => {
//       console.log(dom.window.document.body.textContent.trim());
    

//     });
// });
// });








// describe('testFUn', function(){
  
//   it('testfund', function(){
//     assert.equal(1,testfun(0));
//   })
// })
