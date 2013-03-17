/*global pyfy,Derived*/

pyfy.Calendar = Calendar;

function Calendar(d,calendar) {
  if (!(this instanceof Calendar))
    return new Calendar();
  Derived.call(this,d);
  if (calendar) this.calendar = calendar;
}

Calendar.prototype = new Derived();

Calendar.prototype.rawDates = function(query) {
  query = pyfy.query(this.ID,query);
  var cache = query.cache[this.ID];

  cache.dateMap = {};
  cache.rawDates = {};

  for (var pd in this.parent.rawDates(query)) {
    var d = this.calendar(new Date(+pd)).valueOf();
    cache.rawDates[d] = +d;
    cache.dateMap[d] = +pd;
  }

  return cache.rawDates;
};

Calendar.prototype.fn = function(query,d) {
  var cache = query.cache[this.ID];
  return query.fetch(this.parent,cache.dateMap[d] || this.calendar(d));
};

Calendar.prototype.calendar = function(d) {
  var weekday = d.getDay();
  return (weekday === 0 || weekday === 6) ? this.calendar(new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)) : d;
};