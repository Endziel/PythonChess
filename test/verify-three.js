// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

const THREE = require('three');
const assert = require('assert');
var ThreeJsView = require('../projekt/public/threeJsViewRs.js');


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

describe('The ThreeJsViewClass', function(){
    it('pass basic test', function(){
        assert.equal(4,ThreeJsView);
    })
})
