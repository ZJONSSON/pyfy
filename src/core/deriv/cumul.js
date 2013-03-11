/*global pyfy,Derived*/

pyfy.Cumul = Cumul;

function Cumul(d) {
  Derived.call(this,d);
}

Cumul.prototype = new Derived();

Cumul.prototype.fn = function(res,d,i) {
  return this.parent.fetch(res,d,i) + (i>0 && res.cache[this.ID].values[i-1]);
};