/*global pyfy,Derived*/

pyfy.Calendar = function(parent,calendar) {
  return new Calendar()
    .set("parent",parent)
    .set("calendar",calendar || pyfy.calendar.weekday);
};

function Calendar() {
  Base.call(this);
}

Calendar.prototype = new Base();

Calendar.prototype.checkDate = function(date) {
  date = new Date(date);
  var calendar = [].concat(this.args.calendar),
      i=0;

  // Every calendar function must return true, otherwise we go to the next day
  function isHoliday() {
    return !calendar.every(function(d) {
      var fn = (typeof d === "string") ?  pyfy.calendar[d] : d;
      return fn(date);
    },this);
  }

  function nextDay() {
    date = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
    // Prevent infinite loop if calendar function is wrongly specified 
    if (i++ > 31) throw "Calendar function always returns false";
  }

  while (isHoliday()) nextDay();
  return date.valueOf();
};

Calendar.prototype.rawDates = function(rawDates,query) {
  var cache = query.cache[this.ID];
  rawDates = {};
  cache.dateMap = {};

  for (var pd in this.args.parent.rawDates()) {
    var date = this.checkDate(+pd);
    rawDates[date] = +date;
    cache.dateMap[date] = +pd;
  }

  return rawDates;
};

Calendar.prototype.fn = function(query,d) {
  var cache = query.cache[this.ID];
  return query.fetch(this.args.parent,cache.dateMap[d] || this.calendar(d));
};
