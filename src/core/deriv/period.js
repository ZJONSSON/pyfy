/*global pyfy,Derived*/

pyfy.Period = Period;

function Period(d,start,fin) {
  Derived.call(this,d);
  this.start = start || -Infinity;
  this.fin = fin || Infinity;
}

Period.prototype = new Derived();

Period.prototype.fn = function(cache,d,i) {
  return (d>= this.start && d<= this.fin) ? this.parent.fetch(cache,d,i) : 0;
};