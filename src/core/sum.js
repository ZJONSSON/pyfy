/*global pyfy,Base*/

pyfy.sum = function(d) {
  return new Sum(d);
};

function Sum(d) {
  this.parents = d;
}

Sum.prototype = new Base();

Sum.prototype.inputs = function() {
  return this.parents;
}

Sum.prototype.fn = function(cache,d,i) {
  var sum = 0;
  this.parents.forEach(function(d) {
    sum+=d.fetch(cache,d,i);
  });
  return sum;
};