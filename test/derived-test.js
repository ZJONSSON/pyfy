var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js"),
  testData = require("./testData.js"),
  parent = pyfy.flow(testData.a);

var suite = vows.describe("derived");

suite.addBatch({
  "default" : {
    topic : new pyfy.Derived(),
     "has base as prototype" : function(_) {
      assert.isTrue(pyfy.Base.prototype.isPrototypeOf(_));
    },
    "returns empty by default " : function(_) {
      assert.deepEqual(_.y(),[]);
    },
    "returns zero for any dates" : function(_) {
      assert.deepEqual(_.y([new Date(2013,1,1),new Date(2014,1,1)]),[0,0]);
    }
  },
  "with parent" : {
    topic : new pyfy.Derived(parent),
    "inputs returns the parent" : function(_) {
      assert.equal(_.inputs(),parent);
    },
    "dates are derived from parent" : function(_) {
      assert.deepEqual(_.dates(),testData.a.map(function(d) { return d.x;}));
    },
    "values are derived from parent" : function(_) {
      assert.deepEqual(_.y(),[100,120,-10]);
    }
  }
});

suite.export(module);