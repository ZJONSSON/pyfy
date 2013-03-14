var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("max");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().max(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    topic : parent.max(105),
     "has derived as prototype" : function(_) {
      assert.isTrue(pyfy.Derived.prototype.isPrototypeOf(_));
    },
    "returns maximum value" : function(_) {
      assert.deepEqual(_.y(),[105,120,105]);
    }
  }
});

suite.export(module);