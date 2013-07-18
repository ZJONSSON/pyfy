/*global pyfy,Derived*/

pyfy.diff = Diff;

function Diff(d) {
  if (!(this instanceof Diff))
    return new Diff();
  Derived.call(this,d);
}

Diff.prototype = new Derived();

Diff.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);

  return (datePos) ? query.fetch(this.args.parent,d,i) - query.fetch(this.args.parent,dates[datePos-1],i) : 0;
};