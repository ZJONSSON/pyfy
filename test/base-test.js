var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js");

var suite = vows.describe("base");

suite.addBatch({
  "ID" : {
    "Should be a number" : function() {
      assert.isNumber(pyfy.base().ID);
    },
    "and should increase by one" : function() {
      assert.equal(pyfy.base().ID-pyfy.base().ID,-1);
    }
  },
  'rawDates' : {
    topic : pyfy.base(),
    'returns empty object by default' : function (_) {
      assert.isEmpty(Object.keys(_.rawDates()));
    }
  }
});

suite.export(module);