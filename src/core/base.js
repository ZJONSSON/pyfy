pyfy.Base = Base;

var ID=0;

function Base() {
  this.ID = ID++;
}

Base.prototype.dates = function(d) {
  var self = this,
      dates = [],
      rawDates = this.rawDates();

  if (d) [].concat(d).forEach(function(d) { rawDates[d]= d;}); // add user-dates if applicable

  for (var date in rawDates) {
    dates.push(rawDates[date]);
  }

  return dates.sort(ascending);
};

Base.prototype.rawDates = function(dates,ids) {
  return dates || {};
};

Base.prototype.point = function(d,cache) {
  var res = 0;
  this.value(d,cache).forEach(function(e,i) {
    if (e.x == d) res =  e.y;
  });
  return res;
};


Base.prototype.value = function(dates,cache) {
  return this.get(dates,cache)[this.ID];
};

Base.prototype.y = function(dates,cache) {
  return this.value(dates,cache).map(function(d) {
    return d.y;
  });
};

Base.prototype.x = function(dates,cache) {
  return this.dates(dates);
};

Base.prototype.get = function(dates,cache) {
  if (!cache) cache = {};

  var allDates = cache.__dates__ = this.dates(dates).sort(ascending);
  cache.__dt__ = allDates.map(function(d,i) { return (d-(allDates[i-1] || allDates[0]))/ DAYMS;});
  if (!cache[this.ID]) cache[this.ID] = [];
  var l = cache.__dates__.length,i;

  for (i=0;i<l;i++) {
    this.fetch(cache,cache.__dates__[i],i);
    if (cache[this.ID].length == l) {break;}
  }
  return cache;
};

Base.prototype.fetch = function(cache,d,i) {
  if (!cache[this.ID]) cache[this.ID] = [];
  if (cache[this.ID][i] === undefined) cache[this.ID][i] = {x:d,y:this.fn(cache,d,i)};
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

Base.prototype.filter = function(min,max) {
  return new Filter(this,min,max);
};