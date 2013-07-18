var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("period");

suite.addBatch({
  "no data" : {
    topic : pyfy.base().period(),
    "returns empty array" : function(_) {
      assert.deepEqual(_.y(),[]);
    }
  },
  "with data" : {
    "full period" : function() {
      assert.deepEqual(parent.period(new Date(1970,1,1),new Date(2100,1,1)).y(),[100,120,-10]);
    },
    "partial lower" : function() {
      assert.deepEqual(parent.period(new Date(1970,1,1),new Date(2013,12,1)).y(),[100,120]);
    },
    "partial higher" : function() {
      assert.deepEqual(parent.period(new Date(2013,2,2),new Date(2100,12,1)).y(),[120,-10]);
    }
  }
});

suite.export(module);