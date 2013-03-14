/*global pyfy,Derived*/

pyfy.Prev = Prev;

function Prev(d,start) {
  Derived.call(this,d);
  this.default = start || 0;
}

Prev.prototype = new Derived();

Prev.prototype.fn = function(query,d) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
  return (datePos > 0) ? query.fetch(this.parent,dates[datePos-1]) : this.default;  
};