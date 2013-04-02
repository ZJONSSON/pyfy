/*global pyfy,Derived*/

pyfy.diff = Diff;

function Diff(parent) {
  if (!(this instanceof Diff))
    return new Diff(parent);
  Base.call(this);
  this.args.parent = parent;
}

Diff.prototype = new Base();

Diff.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);

  return (datePos) ? query.fetch(this.args.parent,d,i) - query.fetch(this.args.parent,dates[datePos-1],i) : 0;
};