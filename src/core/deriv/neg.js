/*global pyfy,Derived*/

pyfy.Neg = Neg;

function Neg(d) {
  if (!(this instanceof Neg))
    return new Neg();
  Derived.call(this,d);
}

Neg.prototype = new Derived();

Neg.prototype.fn = function(query,d) {
  return -query.fetch(this.args.parent,d);
};