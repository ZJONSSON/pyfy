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

Dcf.prototype.rawDates = function(res) {
  res = res || new Res(this.ID);
  if (this.customDates) {
    [].concat(this.customDates).forEach(function(d) {
      res.rawDates[d] = d;
    },this);
  }
  return res.rawDates;
};

Dcf.prototype.fn = function(res) {
  var ownDates = {},
      dates = this.dates();

  if (!dates.length) dates = cache.__dates__;

  dates.slice(1).map(function(d,i) {
    var d1 = pyfy.util.dateParts(dates[i]),
        d2 = pyfy.util.dateParts(d);
    ownDates[d] = this.daycount(d1,d2);
  },this);

  res.cache[this.ID].values = res.dates.map(function(d) {
    return ownDates[d] || 0;
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

