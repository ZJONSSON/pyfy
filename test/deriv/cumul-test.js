var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("cumul");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().cumul(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    topic : parent.cumul(),
     "has derived as prototype" : function(_) {
      assert.isTrue(pyfy.Derived.prototype.isPrototypeOf(_));
    },
    "returns cumulative values" : function(_) {
      assert.deepEqual(_.y(),[100,220,210]);
    }
  }
});

suite.export(module);