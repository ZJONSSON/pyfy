/*global pyfy,Derived*/

pyfy.Min = Min;

function Min(d,min) {
  Derived.call(this,d);
  this.min = min || 0;
}

Min.prototype = new Derived();

Min.prototype.fn = function(cache,d,i) {
  return Math.min(this.parent.fetch(cache,d,i),this.min);
};