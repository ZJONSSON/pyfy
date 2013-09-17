/*global pyfy,Base */
Base.register("low");

pyfy.low = function(parent) {
  return new Low()
    .set("parent",parent);
};

function Low(d) {
  Base.call(this);
}

Low.prototype = new Base();

Low.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
 
  return Math.min(query.fetch(this.args.parent,d,i),  (datePos ? query.fetch(this,dates[datePos-1],i) : Infinity));
};
