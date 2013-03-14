var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js");

var suite = vows.describe("flow");

suite.addBatch({
  "empty" : {
    topic : pyfy.flow(),
    "has data as prototype" : function(_) {
      assert.isTrue(pyfy.Data.prototype.isPrototypeOf(_));
    },
    "returns zero length array if empty" : function(_) {
      assert.deepEqual(_.y(),[]);
    },
    "returns array of zero for specified date" : function(_) {
      assert.deepEqual(_.y(new Date()),[0]);
    }
  },
  "with data" : {
    topic : pyfy.flow(testData.a),
    "returns input values" : function(_) {
      assert.deepEqual(_.y(),[100,120,-10]);
    },
    "returns zeros for dates with no data" : function(_) {
      assert.deepEqual(_.y(testData.getDates("a")),[0, 0, 100, 0,  120, -10, 0]);
    }
  }
});

suite.export(module);