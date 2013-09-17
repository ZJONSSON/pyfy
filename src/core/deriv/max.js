/*global pyfy,Derived*/
Base.register("max");

pyfy.max = function(parent,max) {
  return new Max()
    .set("parent",parent)
    .set("max",max);
};

function Max() {
  Base.call(this);
}

Max.prototype = new Base();

Max.prototype.fn = function(query,d,i) {
  return Math.max(query.fetch(this.args.parent,d,i),this.args.max) ;
};