var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js");

var d = [{x:new Date(2013,1,3),y:100},{x:new Date(2013,6,4),y:200}];

var suite = vows.describe("data");

suite.addBatch({
  "empty" : {
    topic : new pyfy.Data(),
    "has base as prototype" : function(data) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(data));
    },
    "returns zero length array if empty" : function(data) {
      assert.deepEqual(data.y(),[]);
    },
    "returns array of zero for specified date" : function(data) {
      assert.deepEqual(data.y([new Date()]),[0]);
    }
  },
  "with data" : {
    topic : new pyfy.Data(d),
    "rawDates match inputs" : function(data) {
      var expected = {};
      d.forEach(function(d) {
        expected[d.x] = d.x;
      });
      assert.deepEqual(data.rawDates(),expected);
    },
    "dates match inputs" : function(data) {
      var expected = d.map(function(d) { return d.x; }).sort();
      assert.deepEqual(data.dates(),expected);
    }
  }
});

suite.export(module);

