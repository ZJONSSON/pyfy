/*global pyfy,Derived,Random*/
function Correl(parent,correl,random) {
  if (!(this instanceof Correl))
    return new Correl(parent,correl);
  Random.call(this);
  this.args.parent = parent;
  this.args.random = random || new Random();
  this.args.correl = correl;
}

pyfy.correl = Correl;

Correl.prototype = new Random();

// The function returns a correlated random variable to the parent
// by multiplying parent value with correlation plus a new random
// variable (using same function as parent) multiplied by
// sqrt of (1-correlation^2)

Correl.prototype.fn = function(query,d,i) {
  var correl = query.fetch(this.args.correl,d,i);
  return correl * query.fetch(this.args.parent,d,i) +
    Math.sqrt(1-correl*correl) * query.fetch(this.args.random,d,i);
};