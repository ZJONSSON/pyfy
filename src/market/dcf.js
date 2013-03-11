/*global pyfy,Base*/
pyfy.Dcf = Dcf;

function Dcf(parent,daycount) {
  Derived.call(this,parent);
  if (daycount !== undefined) this.setDaycount(daycount);
}

Dcf.prototype = new Derived();

Dcf.prototype.fn = function(res) {
  var dates = this.dates(),
      ownDates = {};

  dates.slice(1).map(function(d,i) {
    var d1 = pyfy.util.dateParts(dates[i]),
        d2 = pyfy.util.dateParts(d);
    ownDates[d] = this.daycount(d1,d2);
  },this);

  res.cache[this.ID].values = res.dates.map(function(d) {
    return ownDates[d] || 0;
  });
};

Dcf.prototype.daycount = pyfy.daycount.d_30_360;

Dcf.prototype.setDaycount = function(d) {
  this.daycount = (typeof d === "string")
    ? pyfy.daycount[d]
    : d;
  return this;
}

