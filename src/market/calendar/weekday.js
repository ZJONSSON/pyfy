/*global pyfy*/
pyfy.calendar.weekday = function(d) {
  var weekday = d.getDay();
  return (weekday !== 0 && weekday != 6);
};

