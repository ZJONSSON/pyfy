/*global pyfy,Base*/

pyfy.sum = Sum;

// Quick hack with variables, as we can not apply to "new"
function Sum(a,b,c,d,e,f,g,h) {
  if (!(this instanceof Sum))
    return new Sum(a,b,c,d,e,f,g,h);
  Base.call(this);

  Array.prototype.slice.call(arguments).map(function(d,i) {
    if (d) this.args[i] = d;
  },this)
}

Sum.prototype = new Base();

Sum.prototype.fn = function(query,d) {
  var sum = 0;
  Object.keys(this.args).forEach(function(key) {
    sum+=query.fetch(this.args[key],d);
  },this);
  return sum;
};