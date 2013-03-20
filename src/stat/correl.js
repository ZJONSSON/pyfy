/*global pyfy,Derived,Random*/
function Correl(parent,correl) {
  if (!(this instanceof Correl))
    return new Correl(parent,correl);
  Random.call(this);
  this.args.parent = parent;
  this.args.correl = correl;
}

pyfy.correl = Correl;

Correl.prototype = new Random();

// The function returns a correlated random variable to the parent
// by multiplying parent value with correlation plus a new random
// variable (using same function as parent) multiplied by
// sqrt of (1-correlation^2)

Correl.prototype.fn = function(query,d) {
  var correl = query.fetch(this.args.correl,d);
  return correl * query.fetch(this.args.parent,d) +
    Math.sqrt(1-correl*correl) * this.args.parent.fn.call(this,query,d);
};