/*global pyfy*/
pyfy.calendar.target = function(date) {
  var m = date.getMonth(),
      d = date.getDate();
  return pyfy.calendar.weekday(date) && 
    pyfy.calendar.easter(date,[+1,-2]) &&
    !(m===0 && d == 1) &&
    !(m==11 && (d == 26 || d == 25))  &&
    !(m==4 && d == 1);
};