/*global pyfy,Base*/

pyfy.sum = function() {
  var sum = new Sum();
  Array.prototype.slice.call(arguments).forEach(function(d,i) {
    sum.args[i] = d;
  })
  return sum;
};

function Sum() {
  Base.call(this);
}

Sum.prototype = new Base();

Sum.prototype.fn = function(query,d,i) {
  var sum = 0;
  Object.keys(this.args).forEach(function(key) {
    sum+=query.fetch(this.args[key],d,i);
  },this);
  return sum;
};