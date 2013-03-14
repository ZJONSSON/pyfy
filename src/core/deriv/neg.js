/*global pyfy,Derived*/

pyfy.Neg = Neg;

function Neg(d) {
  Derived.call(this,d);
}

Neg.prototype = new Derived();

Neg.prototype.fn = function(query,d) {
  return -query.fetch(this.parent,d);
};