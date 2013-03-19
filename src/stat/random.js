/*global pyfy,Base*/
function Random() {
  if (!(this instanceof Random))
    return new Random();
  Base.call(this);
}

pyfy.random = Random;

Random.prototype = new Base();

Random.prototype.fn = function() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
};

Random.prototype.correl = function(correl) {
  return pyfy.correl(this,correl);
};

Random.prototype.wiener = function() {
  return pyfy.wiener(this);
}
