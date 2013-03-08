var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js");

var data = [{x:new Date(2013,1,3),y:100},{x:new Date(2013,6,4),y:200}];


var suite = vows.describe("price");

suite.addBatch({
  "with basic data" : {
    topic : pyfy.price(data),
    "has data prototype" : function(price) {
      assert.isTrue(pyfy.Data.prototype.isPrototypeOf(price));
    },    
    "returns input values" : function(price) {
      assert.deepEqual(price.y(),[100,200]);
    },
    "returns last value with extrapolation" : function(price) {
      assert.deepEqual(price.y([new Date(2012,1,1),new Date(2013,2,2),new Date(2014,1,1)]),[100,100,117.88573005796302,200,200]);
    }
  }
});

suite.export(module);