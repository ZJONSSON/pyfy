/*global pyfy,Derived*/

pyfy.Prev = Prev;

function Prev(d,start) {
  Derived.call(this,d);
  this.default = start || 0;
}

Prev.prototype = new Derived();

Prev.prototype.fn = function(res,d) {
  var dates = this.dates(res),
      datePos = res.cache[this.ID].datePos[d];
  return (datePos > 0) ? res.fetch(this.parent,dates[datePos-1]) : this.default;  
};