/*global pyfy,Derived*/

pyfy.prev = Prev;

function Prev(parent,start) {
  if (!(this instanceof Prev))
    return new Prev(parent,start);
  Base.call(this);
  this.args.parent = parent;
  this.args.start = start || 0;
}

Prev.prototype = new Base();

Prev.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
  return (datePos > 0) ? query.fetch(this.args.parent,dates[datePos-1],i) : this.args.start;
};