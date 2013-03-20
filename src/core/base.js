/*global pyfy,Cumul,Diff,Prev,Max,Min,Neg,Derived,Period,Dcf,Calendar,ascending*/

var ID=0;

pyfy.base = pyfy.Base = Base;

function Base() {
  if (!(this instanceof Base))
    return new Base();
  this.ID = ID++;
  this.args = {};
}


Base.prototype.rawDates = function(query) {
  query = pyfy.query(this.ID,query);
  var cache = query.cache[this.ID];

  if (!cache.rawDates && this.args) {
    var args = this.args;
    cache.rawDates = {};

    Object.keys(args)
      .forEach(function(key) {
        if (args[key] && args[key].rawDates)
          Object.keys(args[key].rawDates(query)).forEach(function(d) {
            cache.rawDates[d] = +d;
          });
      });
  }
  return cache.rawDates;
};

Base.prototype.fn = function() {
  return 0;
};

// Allow derived object by chaining
[Cumul,Diff,Prev,Max,Min,Neg,Calendar,Dcf,Period,Derived].forEach(function(Fn) {
  Base.prototype[Fn.name.toLowerCase()] = function(a,b,c) {
    return new Fn(this,a,b,c);
  };
});

Base.prototype.pv= function(curve) {
  var pv = 0;
  if (!isNaN(curve)) curve = pyfy.ir(curve);

  this.mul(curve.df).y().forEach(function(cf) {
    pv+=cf;
  });
  return pv;
};

Base.prototype.y = function(dates) {
  return pyfy.query().get(this,dates);
};

Base.prototype.x = function(dates) {
  return pyfy.query().x(this,dates);
};

Base.prototype.val = function(dates) {
  return pyfy.query().val(this,dates);
};

Base.prototype.dates = function() {
  return pyfy.query().dates(this)
    .map(function(d) {
      return new Date(d);
    });
};
