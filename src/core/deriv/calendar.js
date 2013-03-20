/*global pyfy,Derived*/

pyfy.Calendar = Calendar;

function Calendar(d,calendar) {
  if (!(this instanceof Calendar))
    return new Calendar(d,calendar);
  Derived.call(this,d);
  this.args.calendar = calendar || pyfy.calendar.weekday;
}

Calendar.prototype = new Derived();

Calendar.prototype.rawDates = function(query) {
  query = pyfy.query(this.ID,query);
  var cache = query.cache[this.ID];

  cache.dateMap = {};
  cache.rawDates = {};

  for (var pd in this.args.parent.rawDates(query)) {
    var date = new Date(+pd),
        calendar = [].concat(this.args.calendar),
        i = 0;

    // Every calendar function must return true, otherwise we go to the next day
    while (!calendar.every(function(d) {
      var fn = (typeof d === "string") ?  pyfy.calendar[d] : d;
      return fn(date);
    },this)) {
      date = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
      // Prevent infinite loop if calendar function is wrongly specified 
      if (i++ > 31) throw "Calendar function always returns false";
    }

    date = date.valueOf();
    cache.rawDates[date] = +date;
    cache.dateMap[date] = +pd;
  }

  return cache.rawDates;
};

Calendar.prototype.fn = function(query,d) {
  var cache = query.cache[this.ID];
  return query.fetch(this.args.parent,cache.dateMap[d] || this.calendar(d));
};

Calendar.prototype.calendar = pyfy.calendar.weekday;