var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../pyfy.js");

// Original test assumptions borrowed from:
// http://www.deltaquants.com/day-count-conventions.html

var testDates = [
  [new Date(2007,11,28),new Date(2008,1,28)],
  [new Date(2007,11,28),new Date(2008,1,29)],
  [new Date(2007,9,31), new Date(2008,10,30)],
  [new Date(2008,1,1), new Date(2009,4,31)]
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
  return testDates.map(function(d) {
    return pyfy.dcf(d,pyfy.daycount[key]).y()[1]
  });
}


Object.keys(expected).forEach(function(key) {
  batch[key] = function() {
    assert.deepEqual(exec(key),expected[key]);
  };
});

suite.addBatch(batch)
  .export(module);