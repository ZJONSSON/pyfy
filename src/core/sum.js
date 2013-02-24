/*global pyfy,Base*/

pyfy.sum = function() {
  return new Sum.apply(this,arguments);
};

function Sum() {
  this.parents = Array.prototype.slice(arguments);
}

Sum.prototype = new Base();

Sum.prototype.dates = function() {
  var dates = {};
  this.parents.forEach(function(d) {
    d.dates().forEach(function(d) {
      dates[d] = d;
    });
  });
  return Object.keys(dates)
    .map(function(key) {
      return dates[key];
    }).sort(ascending);
};

Sum.prototype.fn = function(cache,d,i) {
  var sum = 0;
  this.parents.forEach(function(d) {
    sum+=d.fetch(cache,d,i).y;
  });
  return sum;
};