var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js"),
  testData = require("./testData.js"),
  sa = pyfy.stock(testData.a),
  fa = pyfy.flow(testData.a),
  sb = pyfy.stock(testData.b),
  fb = pyfy.flow(testData.b);

var suite = vows.describe("sum");

suite.addBatch({
  "" : {
    topic : pyfy.sum([sa,sb,fa,fb]),
    "has base as a prototype" :  function(_) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(_));
    },
    "returns full sum" : function(_) {
      assert.deepEqual(_.y(),[108,220,250,220,30,190]);
    }
  }
});

suite.export(module);