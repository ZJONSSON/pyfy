/*global pyfy,Derived*/
pyfy.Dcf = Dcf;

function Dcf(parent,daycount) {
  Derived.call(this,parent);
  if (daycount !== undefined) this.setDaycount(daycount);
}

Dcf.prototype = new Derived();

Dcf.prototype.fn = function(res) {
  var cache = res.cache[this.ID];
  if (Object.keys(cache.values).length) return 0;
  var dates = this.dates();
  cache.values = {};

  dates.slice(1).forEach(function(d,i) {
    var d1 = pyfy.util.dateParts(dates[i]),
        d2 = pyfy.util.dateParts(d);
    cache.values[d] = this.daycount(d1,d2);
  },this);
};

Dcf.prototype.daycount = pyfy.daycount.d_30_360;

Dcf.prototype.setDaycount = function(d) {
  this.daycount = (typeof d === "string")
    ? pyfy.daycount[d]
    : d;
  return this;
};

