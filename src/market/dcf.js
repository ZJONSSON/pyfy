/*global pyfy,Base*/
pyfy.Dcf = Dcf;

pyfy.dcf = function(a,b,c) {
  return new Dcf(a,b,c);
};

function Dcf(dates,daycount,calendar) {
  Base.apply(this,arguments);
  this.customDates = dates;
  if (daycount !== undefined) this.daycount = daycount;
  if (calendar !== undefined) this.calendar = calendar;
  
}

Dcf.prototype = new Base();

Dcf.prototype.rawDates = function(dates) {
  dates = dates || {};
  if (this.customDates) {
    [].concat(this.customDates).forEach(function(d) {
      d = this.calendar(d);
      dates[d] = d;
    },this);
  }
  return dates;
};

Dcf.prototype.fn = function(cache) {
  var res = {},
      dates = this.dates();

  if (!dates.length) dates = cache.__dates__;

  dates.slice(1).map(function(d,i) {
    var d1 = pyfy.util.dateParts(dates[i]),
        d2 = pyfy.util.dateParts(d);
    res[d] = this.daycount(d1,d2);
  },this);

  cache[this.ID] = cache.__dates__.map(function(d) {
    return res[d] || 0;
  });
};

Dcf.prototype.calendar = function(d) {
  return d;
};

Dcf.prototype.daycount = pyfy.daycount.d_30_360;

Dcf.prototype.setDaycount = function(d) {
  this.daycount = (typeof d === "string")
    ? pyfy.daycount[d]
    : d;
  return this;
}

