/*global pyfy,Derived*/

pyfy.cumul = Cumul;

function Cumul(parent) {
  if (!(this instanceof Cumul))
    return new Base(parent);
  Base.call(this);
  this.args.parent = parent;
}

Cumul.prototype = new Base();

Cumul.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
  return query.fetch(this.args.parent,d,i) + (datePos ? query.fetch(this,dates[datePos-1],i) : 0);
};