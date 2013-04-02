/*global pyfy,Derived*/

pyfy.diff = function(parent) {
  return new Diff()
    .set("parent",parent);
};

function Diff() {
  Base.call(this);
}

Diff.prototype = new Base();

Diff.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);

  return (datePos) ? query.fetch(this.args.parent,d,i) - query.fetch(this.args.parent,dates[datePos-1],i) : 0;
};