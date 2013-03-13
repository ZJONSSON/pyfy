pyfy.util = {};

pyfy.util.DAYMS = 1000*60*60*24;

pyfy.util.dateParts = function(d) {
  d = new Date(d);
  var res =  {
    y : d.getFullYear(),
    m : d.getMonth(),
    d : d.getDate()
  };
  res.date = new Date(res.y,res.m,res.d);
  res.lastofMonth = (new Date(res.y,res.m,res.d+1)).getMonth() == res.m + 1;
  res.lastFeb = (res.m == 2 && res.lastofMonth);
  return res;
};


pyfy.util.today = function() {
  return pyfy.util.dateParts(new Date()).date;
};

pyfy.util.nextDay = function(d,i) {
  if (i === undefined) i=0;
  return new Date(d.getFullYear(),d.getMonth(),d.getDate()+i);
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