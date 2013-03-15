/*global pyfy,Base*/

pyfy.wiener = function(s,vol,r) {
  return new Wiener(s,vol,r);
};

function rndNorm() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function Wiener() {
  Base.apply(this);
  this.change= this.diff(this);
}

Wiener.prototype = new Base();

Wiener.prototype.rawDates = function(query) {
  var res = {};
  if (query && query.cache[this.ID].dates) {
    query.cache[this.ID].dates.forEach(function(d) {
      res[d] = d;
    });
  }
  return res;
};

Wiener.prototype.fn = function(query,d) {
  var cache = query.cache[this.ID],
      val;

  // If first value, initialize dates and first/last
  if (!cache.dates) {
    cache.dates = [d];
    cache.first = { x:d, y:0 };
    cache.last = { x:d, y:0};
    return 0;
  }

  // If we are appending we push and update last
  if (d > cache.last.x) {
    cache.dates.push(d);
    val = cache.last.y + rndNorm()*(d-cache.last.x)/pyfy.util.DAYMS/365.25;
    cache.last = {x:d, y:val};
    return val;
  }

  // If we are pre-pending, insert and update first
  if (d < cache.first.x) {
    cache.dates.slice(0,0,d) ;
    val = cache.min.y - rndNorm()*(cache.first.x-d)/pyfy.util.DAYMS/365.25;
    cache.first = {x:d,y:val};
    return val;
  }

  // In any other case we use brownian-bridge
  var datePos = pyfy.util.bisect(cache.dates,d),
      prev = {x:cache.dates[datePos-1]},
      next = {x:cache.dates[datePos]};

  prev.y = query.fetch(this,prev.x);
  next.y = query.fetch(this,next.x);

  cache.dates.splice(datePos,0,d);

  return prev.y + (d - prev.x) / (next.x - prev.x) * (next.y - prev.y);
};

Wiener.prototype.dates = function(query) {
  return (query) ? query.cache[this.ID].dates.all : [];
};