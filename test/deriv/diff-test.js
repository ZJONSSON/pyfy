var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("diff");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().diff(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    topic : parent.diff(),
     "has derived as prototype" : function(_) {
      assert.isTrue(pyfy.Derived.prototype.isPrototypeOf(_));
    },
    "returns differences" : function(_) {
      assert.deepEqual(_.y(),[0,20,-130]);
    }
  }
});

suite.export(module);