var testData =  {
  a : [
    { x : new Date(2013,1,1), y : 100 },
    { x: new Date(2013,6,1),  y : 120 },
    { x: new Date(2014,1,1), y : -10 }
  ],
  b: [
    { x: new Date(2000,1,1), y : 4},
    { x: new Date(2013,1,1), y: 10},
    { x: new Date(2013,9,1), y: 50},
    { x: new Date(2020,1,1), y: 100}
  ],
  dates : [
    new Date(1980,1,1),
    new Date(2001,1,1),
    new Date(2013,3,1),
    new Date(2030,1,1)
  ]
};

testData.getDates = function() {
  var dates = [];
  keys = Array.prototype.slice.call(arguments);
  keys.forEach(function(key) {
    testData[key].forEach(function(d) {
      dates.push(d.x)
    })
  })
  return dates.concat(testData.dates).sort(function(a,b) { return a-b})
}

testData.dataDates = testData.a.map(function(d) { return d.x})
  .slice(1)
  .concat(testData.b.map(function(d) { 
    return d.x;
  }))
  .sort(function(a,b) { return a-b; });

testData.allDates = testData.dataDates
  .concat(testData.dates)
  .sort(function(a,b) { return a-b; });

module.exports = testData;