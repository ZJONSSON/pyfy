/*global pyfy,Cumul,Diff,Last,Max,Min,Neg,Derived,Filter*/

var ID=0;

function Base() {
  this.ID = ID++;
}

pyfy.base = function() {
  return new Base();
};

pyfy.Base = Base;

Base.prototype.dates = function(d) {
  var dates = [],
      rawDates = this.rawDates();

  if (d) [].concat(d).forEach(function(d) { rawDates[d]= d;}); // add user-dates if applicable

  for (var date in rawDates) {
    dates.push(rawDates[date]);
  }

  return dates.sort(ascending);
};

Base.prototype.rawDates = function(dates,ids) {
  dates = dates || {};
  ids = ids || {};

  if (!ids[this.ID] && this.inputs) {
    var inputs = typeof this.inputs === "function" ? this.inputs() : this.inputs;
    ids[this.ID] = true;
    [].concat(this.inputs()).forEach(function(input) {
      if (input.rawDates) input.rawDates(dates,ids);
    });
  }
  return dates;
};

Base.prototype.y = function(dates) {
  return this.exec(dates)[this.ID];
};


Base.prototype.x = function(dates,cache) {
  return this.dates(dates);
};

Base.prototype.val = function(dates) {
  var cache = this.exec(dates);
  return cache[this.ID].map(function(d,i) {
    return {x:cache.__dates__[i],y:d};
  });
};

Base.prototype.exec = function(d) {
  var cache = {},
      dates = cache.__dates__ = this.dates(d),
      l = dates.length; 

  if (!cache.__dt__) cache.__dt__ = dates.map(function(d,i) { 
    return (d-(dates[i-1] || dates[0]))/ DAYMS;
  });
  
  if (!cache[this.ID]) cache[this.ID] = [];
  
  dates.every(function(d,i) {
    this.fetch(cache,d,i);
    return (cache[this.ID].length != l);   // break if we have all values
  },this);
  
  return cache;
};

Base.prototype.fetch = function(cache,d,i) {
  if (!cache[this.ID]) cache[this.ID] = [];
  if (cache[this.ID][i] === undefined) {
    var res = this.fn(cache,d,i);
    if (!cache[this.ID][i]) cache[this.ID][i] = res;
  }
  return cache[this.ID][i];
};

[Cumul,Diff,Last,Max,Min,Neg].forEach(function(Fn) {
  Base.prototype[Fn.name.toLowerCase()] = function(d) {
    return new Fn(this,d);
  };
});

Base.prototype.pv= function(curve,date,cache) {
  var pv = 0;
  this.mul(curve.df(date)).y(null,cache).forEach(function(cf) {
    pv+=cf;
  });
  return pv;
};

Base.prototype.derived = function(fn) {
  return new Derived(this,fn);
};

Base.prototype.period = function(min,max) {
  return new Period(this,min,max);
};

Base.prototype.fn = function() {
  return 0;
};