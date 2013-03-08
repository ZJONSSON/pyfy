var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js");

var data = [{x:new Date(2013,1,3),y:100},{x:new Date(2013,6,4),y:200}];


var suite = vows.describe("stock");

suite.addBatch({
  "with basic data" : {
    topic : pyfy.stock(data),
    "has data prototype" : function(stock) {
      assert.isTrue(pyfy.Data.prototype.isPrototypeOf(stock));
    },    
    "returns input values" : function(stock) {
      assert.deepEqual(stock.y(),[100,200]);
    },
    "returns last value with extrapolation" : function(stock) {
      assert.deepEqual(stock.y([new Date(2012,1,1),new Date(2013,2,2),new Date(2014,1,1)]),[100,100,100,200,200]);
    }
  }
});

suite.export(module);