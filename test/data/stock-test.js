var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js"),
  testData = require("../testData.js");

var data = [{x:new Date(2013,1,3),y:100},{x:new Date(2013,6,4),y:200}];

var suite = vows.describe("stock");

suite.addBatch({
  "with basic data" : {
    topic : pyfy.stock(testData.a),
    "has data prototype" : function(stock) {
      assert.isTrue(pyfy.Data.prototype.isPrototypeOf(stock));
    },    
    "returns input values" : function(stock) {
      assert.deepEqual(stock.y(),[100,120,-10]);
    },
    "returns last value with extrapolation" : function(stock) {
      assert.deepEqual(stock.y(testData.dates),[100,100,100,100,120,-10,-10]);
    }
  }
});

suite.export(module);