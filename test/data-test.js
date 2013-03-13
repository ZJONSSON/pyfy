var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js"),
  testData = require("./testData.js");

var suite = vows.describe("data");

suite.addBatch({
  "empty" : {
    topic : new pyfy.Data(),
    "has base as prototype" : function(_) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(_));
    },
    "returns zero length array if empty" : function(_) {
      assert.deepEqual(_.y(),[]);
    },
    "returns array of zero for specified date" : function(_) {
      assert.deepEqual(_.y([new Date()]),[0]);
    }
  },
  "with data" : {
    topic : new pyfy.Data(testData.a),
    "rawDates match inputs" : function(_) {
      var expected = {};
      testData.a.forEach(function(d) {
        var x = d.x.valueOf();
        expected[x] = x;
      });
      assert.deepEqual(_.rawDates(),expected);
    },
    "dates match inputs" : function(_) {
      var expected = testData.a.map(function(d) { return d.x; }).sort();
      assert.deepEqual(_.x(),expected);
    }
  }
});

suite.export(module);

