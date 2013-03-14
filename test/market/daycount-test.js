var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js");

// Original test assumptions borrowed from:
// http://www.deltaquants.com/day-count-conventions.html

var tests = [
  [{x:new Date(2007,11,28),y:1},{x:new Date(2008,1,28),y:1}],
  [{x:new Date(2007,11,28),y:1},{x:new Date(2008,1,29),y:1}],
  [{x:new Date(2007,9,31),y:1},{x:new Date(2008,10,30),y:1}],
  [{x:new Date(2008,1,1),y:1},{x: new Date(2009,4,31),y:1}]
];

var expected = {
  "d_act_act" : [
    4/365 + 58/366,
    4/365 + 59/366,
    62/365 + 334/366,
    335/366 + 150/365,

  ],
  "d_act_360" : [ 
    62/360, 
    63/360,
    396/360,
    485/360,
  ],
  "d_30_360" : [
    60/360, 
    61/360,
    390/360,
    480/360,
  ],
  "d_30E_360" : [
    60/360,
    61/360,
    390/360,
    479/360,
  ],
  "d_30_360US" : [
    60/360,
    61/360, 
    390/360,
    480/360,
  ] 
};

var suite = vows.describe("daycount"),
    batch = {};

function exec(key) {
  return tests.map(function(d) {
    return pyfy.flow(d).dcf(key).y()[1]
  });
}


Object.keys(expected).forEach(function(key) {
  batch[key] = function() {
    assert.deepEqual(exec(key),expected[key]);
  };
});

suite.addBatch(batch)
  .export(module);