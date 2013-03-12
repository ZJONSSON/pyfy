/*global pyfy,Stock,Derived,fetch*/

pyfy.ir = function(d) {
  return new Ir(d);
};

function Ir() {
  Stock.apply(this,arguments);
  this.df = new Df(this);
  this.dcf = new Dcf(this);
}

Ir.prototype = new Stock();

pyfy.df = function(d) {
  return new Derived(d);
};

function Df(d,val,daycount) {
  Derived.call(this,d);
  this.val = val;
}

Df.prototype = new Dcf();

Df.prototype.fn = function(cache,d,i) {
  return (i===0) ? 1 : 
    fetch(this,cache,d,i-1) * Math.exp(-fetch(this.parent,cache,d,i)*fetch(this.parent.dcf,cache,d,i));
};  