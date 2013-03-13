/*global pyfy,Derived*/

pyfy.Calendar = Calendar;

function Calendar(d,calendar) {
  Derived.call(this,d);
  if (calendar) this.calendar = calendar;
}

Calendar.prototype = new Derived();

Calendar.prototype.rawDates = function(res) {
  res = pyfy.res(this.ID,res);
  var cache = res.cache[this.ID];

  cache.dateMap = {};
  cache.rawDates = {};

  for (var pd in this.parent.rawDates(res)) {
    var d = this.calendar(new Date(+pd)).valueOf();
    cache.rawDates[d] = +d;
    cache.dateMap[d] = +pd;
  }

  return cache.rawDates;
};

Calendar.prototype.fn = function(res,d) {
  var cache = res.cache[this.ID];
  return res.fetch(this.parent,cache.dateMap[d] || this.calendar(d));
};

Calendar.prototype.calendar = function(d) {
  var weekday = d.getDay();
  return (weekday === 0 || weekday === 6) ? this.calendar(new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)) : d;
};