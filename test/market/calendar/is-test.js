var vows = require("vows"),
  assert = require("assert"),
  pyfy = require("../../../pyfy.js");

var testDates = [],
    weekends=[];

var holidays = {};
holidays[new Date(2013,0,1)] = "New Years";
holidays[new Date(2013,2,28)] = "Holy Thursday";
holidays[new Date(2013,2,29)] = "Good Friday";
holidays[new Date(2013,3,1)] = "Easter Monday";
holidays[new Date(2013,3,25)] = "First day of summer";
holidays[new Date(2013,4,1)] = "Labour Day";
holidays[new Date(2013,4,9)] = "Ascension Day";
holidays[new Date(2013,4,20)] = "Pentacost Monday";
holidays[new Date(2013,5,17)] = "Independence Day";
holidays[new Date(2013,7,5)] = "Bank Holiday";
holidays[new Date(2013,11,25)] = "Christmas Day";
holidays[new Date(2013,11,26)] = "Boxing Day";

for (var i=0;i<365;i++) {
  var d = new Date(2013,0,i);
  if (d.getDay()=== 0 || d.getDay() == 6) weekends.push(d);
  else testDates.push(d);
}

var suite = vows.describe("is-calendar");

var batch = {
  "testdates" : {
    topic: function() { return pyfy.calendar.is; },
    "working days" : function(calendar) {
      testDates.forEach(function(d) {
        if (!holidays[d]) assert.isTrue(calendar(d));
      });
    },
    "weekends" : function(calendar) {
      weekends.forEach(function(d) {
        assert.isFalse(calendar(d));
      });
    },
    "holidays": {}
  }
};

testDates.forEach(function(d) {
  if (holidays[d]) batch.testdates.holidays[holidays[d]] = function(calendar) {
    assert.isFalse(calendar(d));
  };
});

suite.addBatch(batch)
  .export(module);