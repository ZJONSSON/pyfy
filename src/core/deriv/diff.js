/*global pyfy,Derived*/

pyfy.Diff = Diff;

function Diff(d) {
  Derived.call(this,d);
}

Diff.prototype = new Derived();

Diff.prototype.fn = function(query,d) {
  var dates = this.dates(query),
      datePos = pyfy.util.bisect(dates,d);

  return (datePos) ? query.fetch(this.parent,d) - query.fetch(this.parent,dates[datePos-1]) : 0;
};