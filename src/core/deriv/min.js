/*global pyfy,Derived*/

pyfy.min = Min;

function Min(parent,min) {
  if (!(this instanceof Min))
    return new Min(parent,min);
  Base.call(this);
  this.args.parent = parent;
  this.args.min = min || 0;
}

Min.prototype = new Base();

Min.prototype.fn = function(query,d,i) {
  return Math.min(query.fetch(this.args.parent,d,i),this.args.min);
};