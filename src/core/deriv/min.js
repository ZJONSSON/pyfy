/*global pyfy,Derived*/

pyfy.min = Min;

function Min(d,min) {
  if (!(this instanceof Min))
    return new Min();
  Derived.call(this,d);
  this.args.min = min || 0;
}

Min.prototype = new Derived();

Min.prototype.fn = function(query,d) {
  return Math.min(query.fetch(this.args.parent,d),this.args.min);
};