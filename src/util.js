pyfy.util = {};

pyfy.util.DAYMS = 1000*60*60*24;

pyfy.util.dateParts = function(d) {
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
  return pyty.util.dateParts(new Date());
};

pyfy.util.nextDay = function(d,i) {
  if (i === undefined) i=0;
  return new Date(d.getFullYear(),d.getMonth(),d.getDate()+i);
}


function ascending(a,b) { return +a-b;}

function fetch(obj,cache,d,i) {
  return (obj.fetch) ? obj.fetch(cache,d,i) : obj;
}