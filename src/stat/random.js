/*global pyfy,Base*/
function Random() {
  if (!(this instanceof Random))
    return new Random();
  Base.call(this);
}

pyfy.random = Random;

Random.prototype = new Base();

// Normal random generator from d3.js (C) Mike Bostock
Random.prototype.fn = function() {
  var x, y, r;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    r = x * x + y * y;
  } while (!r || r > 1);
  return x * Math.sqrt(-2 * Math.log(r) / r);
};

Random.prototype.correl = function(correl) {
  return pyfy.correl(this,correl);
};

Random.prototype.wiener = function() {
  return pyfy.wiener(this);
};
