var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js"),
  testData = require("./testData.js");

var suite = vows.describe("const");

suite.addBatch({
  "default" : {
    topic : pyfy.const(),
     "has base as prototype" : function(_) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(_));
    },
    "returns empty by default " : function(_) {
      assert.deepEqual(_.y(),[]);
    },
    "returns zero for any dates" : function(_) {
      assert.deepEqual(_.y(testData.dates),[0,0,0,0]);
    }
  },
  "value" : {
    topic : pyfy.const(10),
    "returns empty by default" : function(_) {
      assert.deepEqual(_.y(),[]);
    },
    "returns constant for any dates" : function(_) {
      assert.deepEqual(_.y(testData.dates),[10,10,10,10]);
    }
  }
});

suite.export(module);