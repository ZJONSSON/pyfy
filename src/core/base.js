/*global pyfy,Cumul,Diff,Prev,Max,Min,Neg,Period,Dcf,Calendar,TimeDiff*/

var ID=0;

pyfy.base = pyfy.Base = Base;

function Base() {
  if (!(this instanceof Base))
    return new Base();
  this.ID = ID++;
  this.args = {};
  this.version = 0;
  this.cache = true;
}

Base.prototype.set = function(d,v) {
  if (arguments.length ==1 ) return this.args[d];
  this.args[d] = v;
  this.version+=1;
  return this;
};

Base.prototype.useCache = function(d) {
  if (!arguments.length) return this.cache;
  this.cache = d;
  return this;
};

Base.prototype.fn = function() {
  return 0;
};

// Placeholder
Base.prototype.rawDates = undefined;

Base.register = function(fn) {
  Base.prototype[fn] = function(a,b,c) {
    return pyfy[fn](this,a,b,c);
  }
};

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
