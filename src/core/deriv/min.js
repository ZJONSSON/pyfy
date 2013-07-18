/*global pyfy,Derived*/

pyfy.min = Min;

function Min(d,min) {
  if (!(this instanceof Min))
    return new Min(d,min);
  Derived.call(this,d);
  this.args.min = min || 0;
}

Min.prototype = new Derived();

Min.prototype.fn = function(query,d,i) {
  return Math.min(query.fetch(this.args.parent,d,i),this.args.min);
};