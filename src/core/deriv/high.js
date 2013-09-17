/*global pyfy,Base */
Base.register("high");

pyfy.high = function(parent) {
  return new High()
    .set("parent",parent);
};

function High(d) {
  Base.call(this);
}

High.prototype = new Base();

High.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
 
  return Math.max(query.fetch(this.args.parent,d,i),  (datePos ? query.fetch(this,dates[datePos-1],i) : 0));
};
