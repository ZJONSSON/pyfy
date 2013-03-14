/*global pyfy,Derived*/

pyfy.Last = Last;

function Last(d,start) {
  Derived.call(this,d);
  this.default = start || 0;
}

Last.prototype = new Derived();

Last.prototype.fn = function(res,d) {
  var dates = this.dates(res),
      datePos = res.cache[this.ID].datePos[d];
  return (datePos > 0) ? res.fetch(this.parent,dates[datePos-1]) : this.default;  
};