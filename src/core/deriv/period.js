/*global pyfy,Derived*/

pyfy.Period = Period;

function Period(d,start,fin) {
  Derived.call(this,d);
  this.start = start || -Infinity;
  this.fin = fin || Infinity;
}

Period.prototype = new Derived();

Period.prototype.fn = function(query,d) {
  return (d >= this.start && d<= this.fin) ? query.fetch(this.parent,d) : 0;
};