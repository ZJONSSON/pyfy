var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../pyfy.js")


var suite = vows.describe("base")
suite.addBatch({
    "base" : {
      topic : function() {
        return pyfy.Base();
      },
      "has an ID" : function(base) {
        assert.notEqual(base.ID,0)
      }
    }
    
  })

suite.export(module)