var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("last");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().prev(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    topic : parent.prev(),
     "has derived as prototype" : function(_) {
      assert.isTrue(pyfy.Derived.prototype.isPrototypeOf(_));
    },
    "returns last value" : function(_) {
      assert.deepEqual(_.y(),[0,100,120]);
    }
  }
});

suite.export(module);