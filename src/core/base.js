/*global pyfy,Cumul,Diff,Last,Max,Min,Neg,Derived,Res,Period,Dcf,Calendar,ascending*/

var ID=0;

function Base() {
  this.ID = ID++;
}

pyfy.base = function() {
  return new Base();
};

pyfy.Base = Base;

Base.prototype.dates = function(res) {
  res = res || new Res(this.ID);
  var cache = res.cache[this.ID] = res.cache[this.ID] || {values:{}};

  if (!cache.dates) {
    var rawDates = this.rawDates(res);
    cache.dates = [];
    cache.datePos = {};

    for (var date in rawDates) {
      cache.dates.push(+rawDates[date]);
    }

    cache.dates.sort(ascending)
      .forEach(function(d,i) {
        cache.datePos[d] = i;
      });
  }
  return cache.dates;
};

Base.prototype.rawDates = function(res) {
  res = pyfy.res(this.ID,res);
  var cache = res.cache[this.ID];

  if (!cache.rawDates) {
    cache.rawDates = {};
    
    var inputs = typeof this.inputs === "function" ? this.inputs() : this.inputs;
    [].concat(inputs)
      .filter(function(d) { return d && d.rawDates; })
      .forEach(function(input) {
        for (var d in input.rawDates(res)) {
          cache.rawDates[d] = +d;
        }
      });
  }
  return cache.rawDates;
};


Base.prototype.exec = function(d) {
  var res = pyfy.res(this.ID);

  res.dates = this.dates(res);

  if (d) {
    d = [].concat(d)
      .map(function(d) {
        return d.valueOf();
      });

    res.dates = res.dates
      .concat(d)
      .sort(ascending);
  }

  res.dates.forEach(function(d) {
    res.fetch(this,d);
  },this);

  return res;
};

Base.prototype.fn = function() {
  return 0;
};

// Allow derived object by chaining
[Cumul,Diff,Last,Max,Min,Neg,Calendar,Dcf,Period,Derived].forEach(function(Fn) {
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
  return this.exec(dates).y(this.ID);
};

Base.prototype.x = function(dates) {
  return this.exec(dates).x(this.ID);
};

Base.prototype.val = function(dates) {
  return this.exec(dates).val(this.ID);
};