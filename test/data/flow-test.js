var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js");

var data = [{x:new Date(2013,1,3),y:100},{x:new Date(2013,6,4),y:200}];

var suite = vows.describe("flow");

suite.addBatch({
  "empty" : {
    topic : pyfy.flow(),
    "has data as prototype" : function(flow) {
      assert.isTrue(pyfy.Data.prototype.isPrototypeOf(flow));
    },
    "returns zero length array if empty" : function(flow) {
      assert.deepEqual(flow.y(),[]);
    },
    "returns array of zero for specified date" : function(flow) {
      assert.deepEqual(flow.y(new Date()),[0]);
    }
  },
  "with data" : {
    topic : pyfy.flow(data),
    "returns input values" : function(flow) {
      assert.deepEqual(flow.y(),[100,200]);
    },
    "returns zeros for dates with no data" : function(flow) {
      assert.deepEqual(flow.y([new Date(2012,1,1),new Date(2013,2,2),new Date(2014,1,1)]),[0,100,0,200,0]);
    }
  }
});

suite.export(module);