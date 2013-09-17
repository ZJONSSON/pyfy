/*global pyfy,Derived*/
Base.register("prev");

pyfy.prev = function(parent,start) {
  return new Prev()
    .set("parent",parent)
    .set("start",start || 0);
};

function Prev() {
  Base.call(this);
}

Prev.prototype = new Base();

Prev.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
  return (datePos > 0) ? query.fetch(this.args.parent,dates[datePos-1],i) : this.args.start;
};