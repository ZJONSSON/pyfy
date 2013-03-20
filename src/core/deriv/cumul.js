/*global pyfy,Derived*/

pyfy.cumul = Cumul;

function Cumul(d) {
  if (!(this instanceof Cumul))
    return new Cumul(d);
  Derived.call(this,d);
}

Cumul.prototype = new Derived();

Cumul.prototype.fn = function(query,d) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
 
  return query.fetch(this.args.parent,d) + (datePos ? query.fetch(this,dates[datePos-1]) : 0);
};