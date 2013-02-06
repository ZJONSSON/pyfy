pyfy.Neg = Neg;

function Neg(d) {
  Derived.call(this,d);
}

Neg.prototype = new Derived();

Neg.prototype.fn = function(cache,d,i) {
  return -this.parent.fetch(cache,d,i).y ;
};