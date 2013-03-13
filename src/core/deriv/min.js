/*global pyfy,Derived*/

pyfy.Min = Min;

function Min(d,min) {
  Derived.call(this,d);
  this.min = min || 0;
}

Min.prototype = new Derived();

Min.prototype.fn = function(res,d) {
  return Math.min(res.fetch(this.parent,d),this.min);
};