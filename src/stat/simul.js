/*global pyfy*/

function Simul(count) {
  if (!(this instanceof Simul))
    return new Simul(count);
  this.queries = [];
  while (count--) {
    this.queries.push(pyfy.query());
  }
}

pyfy.simul = Simul;

["y","val"].forEach(function(fn) {
  Simul.prototype[fn] = function(obj,dates) {
    return this.queries.map(function(q) {
      return q[fn](obj,dates);
    });
  };
});

Simul.prototype.mean = function(obj,dates) {
  var res = this.y(obj,dates),
      l = res.length;

  res = res[0].map(function(d,i) {
    var sum = 0;
    res.forEach(function(d) {
      sum+=d[i];
    });
    return sum/l;
  });

  return res.length == 1 ? res[0] : res;
};

