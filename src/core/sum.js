/*global pyfy,Base*/

pyfy.sum = Sum;

function Sum(d) {
  if (!(this instanceof Sum))
    return new Sum(d);

  this.parents = d;
}

Sum.prototype = new Base();

Sum.prototype.inputs = function() {
  return this.parents;
};

Sum.prototype.fn = function(query,d) {
  var sum = 0;
  this.parents.forEach(function(parent) {
    sum+=query.fetch(parent,d);
  });
  return sum;
};