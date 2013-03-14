/*global pyfy,Derived*/

pyfy.Max = Max;

function Max(d,max) {
  Derived.call(this,d);
  this.max = max || 0;
}

Max.prototype = new Derived();

Max.prototype.fn = function(query,d) {
  return Math.max(query.fetch(this.parent,d),this.max) ;
};