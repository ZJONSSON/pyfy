var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js");

var suite = vows.describe("interval");

suite.addBatch({
  "output is a flow object" : function() {
    assert.isTrue(pyfy.Data.prototype.isPrototypeOf(pyfy.interval()));
  },
  "no parameters return empty flow" : function() {
    assert.deepEqual(pyfy.interval().y(new Date()),[0]);
  },
  "data results in correct flow specifictation" : function() {
    var interval = pyfy.interval(new Date(2013,0,1),6,5);
    assert.deepEqual(interval.x(),[new Date(2013,0,1),new Date(2013,6,1),new Date(2014,0,1),new Date(2014,6,1),new Date(2015,0,1),new Date(2015,6,1)]);
    assert.deepEqual(interval.y(),[0,1,1,1,1,1]);
  },
  "if start date is unspecified then today is used" : function() {
    var interval = pyfy.interval(null,6,5),
        now = new Date()
    assert.deepEqual(interval.dates()[0],new Date(now.getFullYear(),now.getMonth(),now.getDate()))
  }
});

suite.export(module);