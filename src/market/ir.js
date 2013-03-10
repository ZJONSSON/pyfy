/*global pyfy,Stock,Derived,fetch*/

pyfy.ir = function(d) {
  return new Ir(d);
};

function Ir() {
  Stock.apply(this,arguments);
  this.df = new Df(this);
}

Ir.prototype = new Stock();

Ir.prototype.daycount = pyfy.dcf();

pyfy.df = function(d) {
  return new Df(d);
};

function Df(d,val) {
  Derived.call(this,d);
  this.val = val;
}

Df.prototype = new Derived();

Df.prototype.fn = function(cache,d,i) {
  var self = this,
      dt = cache.__dt__[i] /365;

  return (i===0) ? 1 : 
    fetch(this,cache,d,i-1) * Math.exp(-fetch(self.parent,cache,d,i)*dt);
};  