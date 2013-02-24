/*global pyfy,Base*/
pyfy.Operator = Operator;

var ops = {
  add:function(a,b) { return a+b; },
  sub:function(a,b) { return a-b; },
  mul:function(a,b) { return a*b; },
  div:function(a,b) { return a/b; },
  pow:function(a,b) { return Math.pow(a,b); }
};

Object.keys(ops).forEach(function(op) {
  Base.prototype[op] = function(d) {
    return new Operator(op,this,d);
  };
});

function Operator(op,parent,other) {
  Base.apply(this,arguments);
  this.parent = parent;
  this.other = other;
  this.op = op;
}

Operator.prototype = new Base();

Operator.prototype.rawDates = function(dates,ids) {
  dates = dates || {};
  ids = ids || {};
  if (!ids[this.ID]) {
    ids[this.ID]=true;
    if (this.parent.rawDates) this.parent.rawDates(dates,ids);
    if (this.other.rawDates) this.other.rawDates(dates,ids);
  }
  return dates;
};

Operator.prototype.fn = function(cache,d,i) {
  var a = this.parent.fetch(cache,d,i).y,
      b = (this.other.fetch) ? this.other.fetch(cache,d,i).y : this.other;
  return ops[this.op](a,b);
};