/*global pyfy,Derived*/

pyfy.diff = Diff;

function Diff(d) {
  if (!(this instanceof Diff))
    return new Diff();
  Derived.call(this,d);
}

Diff.prototype = new Derived();

Diff.prototype.fn = function(query,d) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);

  return (datePos) ? query.fetch(this.parent,d) - query.fetch(this.parent,dates[datePos-1]) : 0;
};