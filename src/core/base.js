/*global pyfy,Cumul,Diff,Prev,Max,Min,Neg,Derived,Res,Period,Dcf,Calendar,ascending*/

var ID=0;

function Base() {
  this.ID = ID++;
}

pyfy.base = function() {
  return new Base();
};

pyfy.Base = Base;

Base.prototype.dates = function() {
  var rawDates = this.rawDates();
  var dates = [];
  for (var date in rawDates) {
    dates.push(new Date(+rawDates[date]));
  }
  return dates.sort(ascending);
};

Base.prototype.rawDates = function(query) {
  query = pyfy.query(this.ID,query);
  var cache = query.cache[this.ID];

  if (!cache.rawDates) {
    cache.rawDates = {};
    
    var inputs = typeof this.inputs === "function" ? this.inputs() : this.inputs;
    [].concat(inputs)
      .filter(function(d) { return d && d.rawDates; })
      .forEach(function(input) {
        for (var d in input.rawDates(query)) {
          cache.rawDates[d] = +d;
        }
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
  return pyfy.query().y(this,dates);
};

Base.prototype.val = function(dates) {
  return pyfy.query().val(this,dates);
};