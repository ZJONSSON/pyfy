/*global pyfy,Cumul,Diff,Last,Max,Min,Neg,Derived,Res,Period*/

var ID=0;

function Base() {
  this.ID = ID++;
}

pyfy.base = function() {
  return new Base();
};

pyfy.Base = Base;

Base.prototype.dates = function(d,res) {
  res = res || new Res(this.ID);
  res.dates = [];

  var rawDates = this.rawDates(res);
      
  // add user-dates if applicable
  if (d) [].concat(d).forEach(function(d) {
    res.rawDates[d]= d;
  }); 

  for (var date in rawDates) {
    res.dates.push(rawDates[date]);
  }

  return res.dates.sort(ascending);
};

Base.prototype.rawDates = function(res) {
  res = res || new Res(this.ID);
  res.cache[this.ID] = res.cache[this.ID] || {};

  if (!res.cache[this.ID].rawDates && this.inputs) {
    var inputs = typeof this.inputs === "function" ? this.inputs() : this.inputs;
    res.cache[this.ID].rawDates = true;
    [].concat(inputs).forEach(function(input) {
      if (input.rawDates) input.rawDates(res);
    });
  }
  return res.rawDates;
};

Base.prototype.y = function(dates) {
  return this.exec(dates).y(this.ID);
};

Base.prototype.x = function(dates) {
  return this.dates(dates);
};

Base.prototype.val = function(dates) {
  return this.exec(dates).val(this.ID);
};

Base.prototype.exec = function(d) {
  var res = new Res(),
      dates = res.dates = this.dates(d,res),
      l = dates.length; 

  res.cache[this.ID] = res.cache[this.ID] || {};
  res.cache[this.ID].values = [];
  
  dates.every(function(d,i) {
    this.fetch(res,d,i);
    return (res.cache[this.ID].values.length != l);   // break if we have all values
  },this);
  
  return res;
};

Base.prototype.fetch = function(res,d,i) {
  if (!res.cache[this.ID]) res.cache[this.ID] = {};
  if (!res.cache[this.ID].values) res.cache[this.ID].values=[];

  if (res.cache[this.ID].values[i] === undefined) {
    var value = this.fn(res,d,i);
    if (value !== undefined) res.cache[this.ID].values[i] = value;
  }
  return res.cache[this.ID].values[i];
};

[Cumul,Diff,Last,Max,Min,Neg,Calendar,Dcf].forEach(function(Fn) {
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