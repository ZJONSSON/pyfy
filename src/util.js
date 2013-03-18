/*global pyfy*/
pyfy.util = {};

pyfy.util.DAYMS = 1000*60*60*24;

pyfy.util.dateParts = function(d) {
  d = new Date(d);
  var query =  {
    y : d.getFullYear(),
    m : d.getMonth(),
    d : d.getDate()
  };
  query.date = new Date(query.y,query.m,query.d);
  query.lastofMonth = (new Date(query.y,query.m,query.d+1)).getMonth() == query.m + 1;
  query.lastFeb = (query.m == 2 && query.lastofMonth);
  return query;
};


pyfy.util.today = function() {
  return pyfy.util.dateParts(new Date()).date;
};

pyfy.util.nextDay = function(d,i) {
  if (i === undefined) i=0;
  return new Date(d.getFullYear(),d.getMonth(),d.getDate()+i);
};


pyfy.util.nextWeekday = function(date,weekday) {
  var currentWeekday = date.getDay()
  var dt = (currentWeekday > weekday)
    ? weekday + 7 -currentWeekday
    : weekday - currentWeekday;
  return new Date(date.getFullYear(),date.getMonth(),date.getDate()+dt);
}

function ascending(a,b) { return +a-b;}

/* bisect copied from d3.js @licence MIT (c) Mike Bostock */
function f(d) { return d;}
pyfy.util.bisect = function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (f.call(a, a[mid], mid) < x) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };