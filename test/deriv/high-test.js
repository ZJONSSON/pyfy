var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("high");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().high(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    topic : parent.high(),
     "has derived as prototype" : function(_) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(_));
    },
    "returns high" : function(_) {
      assert.deepEqual(_.y(),[100,120,120]);
    }
  }
});

suite.export(module);