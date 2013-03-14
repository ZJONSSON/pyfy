/*global pyfy,Base,Stock,Derived,Dcf*/

pyfy.ir = function(d) {
  return new Ir(d);
};

function Ir() {
  Stock.apply(this,arguments);
  this.df = new Df(this);
  this.daycount = pyfy.daycount.d_30_360;
}

Ir.prototype = new Stock();

Ir.prototype.setDaycount = function(d) {
  this.daycount = typeof d === "string" ? pyfy.daycount[d] : d;
  return this;
};

Ir.prototype._fn = function(d,last,next) {
  return this.data[next];
};


pyfy.df = function(d) {
  return new Derived(d);
};

function Df(d,val) {
  Derived.call(this,d);
  this.val = val;
}

Df.prototype = new Dcf();

Df.prototype.fn = function(query,d) {
  var dates = query.dates(this);
  var pos = pyfy.util.bisect(dates,d);
  var last =dates[pos-1];
  if (!last) return d==dates[pos] ? 1 : 0;

  var dcf = this.parent.daycount(pyfy.util.dateParts(last),pyfy.util.dateParts(d));

  return query.fetch(this,last) * Math.exp(-query.fetch(this.parent,d)*dcf);
};  

