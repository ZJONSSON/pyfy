/*global pyfy,Derived*/

pyfy.min = function(parent,min) {
  return new Min()
    .set("parent",parent)
    .set("min",min);
};

function Min() {
  Base.call(this);
}

Min.prototype = new Base();

Min.prototype.fn = function(query,d,i) {
  return Math.min(query.fetch(this.args.parent,d,i),this.args.min);
};