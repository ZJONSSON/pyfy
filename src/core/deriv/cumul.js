/*global pyfy,Derived*/

pyfy.Cumul = Cumul;

function Cumul(d) {
  Derived.call(this,d);
}

Cumul.prototype = new Derived();

Cumul.prototype.fn = function(cache,d,i) {
  return this.parent.fetch(cache,d,i) + (i>0 && cache[this.ID][i-1]);
};