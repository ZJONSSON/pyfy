/*global pyfy,Derived*/

pyfy.Neg = Neg;

function Neg(parent) {
  if (!(this instanceof Neg))
    return new Neg(parent);
  Base.call(this);
  this.args.parent = parent;
}

Neg.prototype = new Base();

Neg.prototype.fn = function(query,d,i) {
  return -query.fetch(this.args.parent,d,i);
};