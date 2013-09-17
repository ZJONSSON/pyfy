/*global pyfy,Derived,Operator*/
Base.register("dcf");

pyfy.dcf = function(parent,daycount) {
  return new Dcf()
    .set("parent",parent)
    .set("daycount",daycount || pyfy.daycount.d_30_360);
};

function Dcf() {
  Base.call(this);
}

Dcf.prototype = new Base();

Dcf.prototype.fn = function(query,d) {
  if (typeof this.args.daycount === "string") this.args.daycount = pyfy.daycount[this.args.daycount];
  var cache = query.cache[this.ID];
  if (!Object.keys(cache.values).length) {
    var dates = query.dates(this);
    cache.values = {};
    dates.slice(1).forEach(function(d,i) {
      var d1 = pyfy.util.dateParts(dates[i]),
          d2 = pyfy.util.dateParts(d);
      cache.values[d] = (dates[i]) ? this.args.daycount(d1,d2) : 0 ;
    },this);
  }
  return cache.values[d] || 0;
};

