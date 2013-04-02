var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("neg");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().neg(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    topic : parent.neg(),
     "has derived as prototype" : function(_) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(_));
    },
    "returns maximum value" : function(_) {
      assert.deepEqual(_.y(),[-100,-120,10]);
    }
  }
});

suite.export(module);