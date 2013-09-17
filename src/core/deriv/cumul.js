/*global pyfy,Derived*/
Base.register("cumul");

pyfy.cumul = function(parent) {
  return new Cumul()
    .set("parent",parent);
};

function Cumul() { Base.call(this); }

Cumul.prototype = new Base();

Cumul.prototype.fn = function(query,d,i) {
  var dates = query.dates(this),
      datePos = pyfy.util.bisect(dates,d);
  return query.fetch(this.args.parent,d,i) + (datePos ? query.fetch(this,dates[datePos-1],i) : 0);
};