/*global pyfy,Derived*/

pyfy.Max = Max;

function Max(d,max) {
  Derived.call(this,d);
  this.max = max || 0;
}

Max.prototype = new Derived();

Max.prototype.fn = function(res,d) {
  return Math.max(res.fetch(this.parent,d),this.max) ;
};