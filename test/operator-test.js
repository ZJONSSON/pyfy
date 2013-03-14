var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js"),
  testData = require("./testData.js"),
  sa = pyfy.stock(testData.a),
  fa = pyfy.flow(testData.a),
  sb = pyfy.stock(testData.b),
  fb = pyfy.flow(testData.b);

var suite = vows.describe("operator");

suite.addBatch({
  "intrinsic dates" : function() {
    [fa.add(fb),sa.add(sb)].forEach(function(_) {
      assert.deepEqual(_.dates(),testData.dataDates.map(function(d) { return d; }));
    });
  },
  "add" : function() {
    assert.deepEqual(fa.add(fb).y(),[4,110,120,50,-10,100]);
    assert.deepEqual(sa.add(sb).y(),[104,110,130,170,40,90]);
  },
  "sub" : function() {
    assert.deepEqual(fa.sub(fb).y(),[-4,90,120,-50,-10,-100]);
    assert.deepEqual(sa.sub(sb).y(),[96,90,110,70,-60,-110]);
  },
  "mul" : function() {
    assert.deepEqual(fa.mul(fb).y(),[0,1000,0,0,0,0]);
    assert.deepEqual(sa.mul(sb).y(),[400,1000,1200,6000,-500,-1000]);
  },
  "div" : function() {
    assert.deepEqual(fa.div(fb).y(),[0,10,Infinity,0,-Infinity,0]);
  }

});

suite.export(module);