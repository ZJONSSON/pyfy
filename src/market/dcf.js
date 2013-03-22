/*global pyfy,Derived,Operator*/
pyfy.dcf = Dcf;

function Dcf(parent,daycount) {
  if (!(this instanceof Dcf))
    return new Operator(parent,daycount);
  Derived.call(this,parent);
  if (daycount !== undefined) this.setDaycount(daycount);
}

Dcf.prototype = new Derived();

Dcf.prototype.fn = function(query,d) {
  var cache = query.cache[this.ID];
  if (!Object.keys(cache.values).length) {
    var dates = query.dates(this);
    cache.values = {};
    dates.slice(1).forEach(function(d,i) {
      var d1 = pyfy.util.dateParts(dates[i]),
          d2 = pyfy.util.dateParts(d);
      cache.values[d] = (dates[i]) ? this.daycount(d1,d2) : 0 ;
    },this);
  }
  return cache.values[d] || 0;
};

Dcf.prototype.daycount = pyfy.daycount.d_30_360;

Dcf.prototype.setDaycount = function(d) {
  this.daycount = (typeof d === "string")
    ? pyfy.daycount[d]
    : d;
  return this;
};

