/*global pyfy,Derived*/

pyfy.Cumul = Cumul;

function Cumul(d) {
  Derived.call(this,d);
}

Cumul.prototype = new Derived();

Cumul.prototype.fn = function(res,d) {
  var dates = this.dates(res),
      datePos = res.cache[this.ID].datePos[d];
 
  return res.fetch(this.parent,d) + (datePos ? res.fetch(this,dates[datePos-1]) : 0);
};