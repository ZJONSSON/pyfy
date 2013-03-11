/*global pyfy,Derived*/

pyfy.Calendar = Calendar;

function Calendar(d,calendar) {
  Derived.call(this,d);
  if (calendar) this.calendar = calendar;
}

Calendar.prototype = new Derived();

Calendar.prototype.rawDates = function(res) {
  res = res || new Res(this.ID);
  var cache = res.cache[this.ID] = res.cache[this.ID] || {};

  if (!cache.rawDates && this.parent) {
    var parentRes = cache.parentRes = new Res(),
        parentDates = this.parent.dates([],parentRes);
        cache.rawDates = true;
    cache.dateMap = {};
    parentDates.forEach(function(d,i) {
      var ownDate = this.calendar(d);
      res.rawDates[ownDate] = ownDate;
      cache.dateMap[ownDate] = {d:d,i:i};
    },this)
  }
  return res.rawDates;
};

Calendar.prototype.fn = function(res,d,i) {
  var cache = res.cache[this.ID],
      dateMap = cache.dateMap[d];
  return (dateMap) 
    ? this.parent.fetch(cache.parentRes,dateMap.d,dateMap.i)
    : 0;
};

Calendar.prototype.calendar = function(d) {
  var weekday = d.getDay();
  return (weekday == 0 || weekday == 6) ? this.calendar(new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)) : d;
}