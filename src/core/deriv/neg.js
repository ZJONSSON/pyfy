/*global pyfy,Derived*/
Base.register("neg");

pyfy.neg = function(parent) {
  return new Neg()
    .set("parent",parent);
};

function Neg() {
  Base.call(this);
}

Neg.prototype = new Base();

Neg.prototype.fn = function(query,d,i) {
  return -query.fetch(this.args.parent,d,i);
};