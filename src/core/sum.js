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
};

Sum.prototype.fn = function(res,d) {
  var sum = 0;
  this.parents.forEach(function(parent) {
    sum+=res.fetch(parent,d);
  });
  return sum;
};