var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js");

var suite = vows.describe("price");

suite.addBatch({
  "with basic data" : {
    topic : pyfy.price(testData.a),
    "has data prototype" : function(_) {
      assert.isTrue(pyfy.Data.prototype.isPrototypeOf(_));
    },    
    "returns input values" : function(_) {
      assert.deepEqual(_.y(),[100,120,-10]);
    },
    "returns last value with extrapolation" : function(_) {
      assert.deepEqual(_.y(testData.getDates("a")),[100,100,100,107.86329535982217,120,-10,-10]);
    }
  }
});

suite.export(module);