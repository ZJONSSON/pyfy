/*global pyfy,Derived*/

pyfy.Diff = Diff;

function Diff(d) {
  Derived.call(this,d);
}

Diff.prototype = new Derived();

Diff.prototype.fn = function(res,d) {
  var dates = this.dates(res),
      datePos = res.cache[this.ID].datePos[d];

  return (datePos) ? res.fetch(this.parent,d) - res.fetch(this.parent,dates[datePos-1]) : 0;
};