/*global pyfy,Derived*/

pyfy.Cumul = Cumul;

function Cumul(d) {
  Derived.call(this,d);
}

Cumul.prototype = new Derived();

Cumul.prototype.fn = function(query,d) {
  var dates = this.dates(query),
      datePos = pyfy.util.bisect(dates,d);
 
  return query.fetch(this.parent,d) + (datePos ? query.fetch(this,dates[datePos-1]) : 0);
};