/*global pyfy,Derived*/

pyfy.Max = Max;

function Max(d,max) {
  Derived.call(this,d);
  this.max = max || 0;
}

Max.prototype = new Derived();

Max.prototype.fn = function(cache,d,i) {
  return Math.max(this.parent.fetch(cache,d,i),this.max) ;
};