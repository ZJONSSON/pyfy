/*global pyfy,Derived*/

pyfy.put = function(parent,strike) {
  return new Put()
    .set("parent",parent)
    .set("strike",strike || 0);
};

function Put() {
  Base.call(this);
}

Put.prototype = new Base();

Put.prototype.fn = function(query,d,i) {
  return Math.max(this.args.strike - query.fetch(this.args.parent,d,i),0) ;
};