/*global pyfy,Derived*/

pyfy.Filter = Filter;

function Filter(d,min,max) {
  Derived.call(this,d);
  this.min = min || -Infinity;
  this.max = max || Infinity;
}

Filter.prototype = new Derived();

Filter.prototype.fn = function(cache,d,i) {
  return (d>= this.min && d<= this.max) ? this.parent.fetch(cache,d,i) : 0;
};