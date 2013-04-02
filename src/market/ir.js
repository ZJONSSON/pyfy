/*global pyfy,Base,Stock,Derived,Dcf*/

pyfy.ir = function(data,options) {
  return new Ir()
    .set("data",data)
    .set("options",options);
};

function Ir() {
  Stock.apply(this,arguments);
  this.df = new Df(this);
  this.args.daycount = pyfy.daycount.d_30_360;
}

Ir.prototype = new Stock();

Ir.prototype.setDaycount = function(d) {
  this.args.daycount = typeof d === "string" ? pyfy.daycount[d] : d;
  return this;
};

Ir.prototype._fn = function(d,last,next) {
  return this.args.data[next];
};


pyfy.df = function(d) {
  return new Derived(d);
};

function Df(parent,val) {
  Base.call(this);
  this.args.parent = parent;
  this.args.val = val;
}

Df.prototype = new Base();

Df.prototype.fn = function(query,d,i) {
  var dates = query.dates(this);
  var pos = pyfy.util.bisect(dates,d);
  var last =dates[pos-1];
  if (!last) return d==dates[pos] ? 1 : 0;

  var dcf = this.parent.daycount(pyfy.util.dateParts(last),pyfy.util.dateParts(d));

  return query.fetch(this,last,i) * Math.exp(-query.fetch(this.args.parent,d,i)*dcf);
}; 

