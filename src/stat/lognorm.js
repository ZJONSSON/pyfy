/*global pyfy,Base,Random*/
"use strict";
pyfy.logNorm = function(spot,vol,drift,random) {
  return new LogNorm()
    .set("spot",spot)
    .set("vol",vol)
    .set("drift",drift)
    .set("random", random || new Random());
};


function LogNorm() {
  Base.apply(this);
}

LogNorm.prototype = new Base();

LogNorm.prototype.fn = function(query,d,i) {
  var cache = query.cache[this.ID];
  i=i||0;

  if (!cache.extent) {
    var spotDates = query.dates(this.args.spot);
    if (spotDates.length) {
      cache.extent = {first:spotDates[0],last:spotDates[spotDates.length-1]};
    } else {
      throw "no date information in spot";
    }
  }

  var res = query.fetch(this.args.spot,d,i);
  if (res) return res;

  var dates = query.dates(this),
      l = dates.length,
      datePos = pyfy.util.bisect(cache.dates,d),
      prev,next,drift,rnd,dt,vol;

  // If d < first date we are "backing"
  var pd = (d < cache.extent.first) ? dates[datePos] : d;
  vol = query.fetch(this.args.vol,pd,i);
  rnd = query.fetch(this.args.random,pd,i);
  drift = query.fetch(this.args.drift,pd,i);
  dt = (d < cache.extent.first) ? (dates[datePos]-d) : (d-dates[datePos-1]);
  dt = dt / (pyfy.util.DAYMS) / 365.25;

  if (d > cache.extent.last) {
    prev = query.fetch(this,dates[datePos-1],i);
    if (!i) {
      dates.push(d);
      cache.extent.last = d;
    }
    return prev * pyfy_exp(vol,drift,rnd,dt);
  } else if (d < cache.extent.first) {
    next = query.fetch(this,dates[datePos],i);
    if  (!i) {
      dates.splice(0,0,d);
      cache.extent.first = d;
    }
    // go back in time
    return next / pyfy_exp(vol,drift,rnd,dt);
  } else {

    prev = query.fetch(this,dates[datePos-1],i);
    next = query.fetch(this,dates[datePos],i);
    // Brownian bridge - drift solely determined by surrounding points
    drift = Math.log(next/prev) / ((dates[datePos]-dates[datePos-1])/pyfy.util.DAYMS / 365.25)  ;
    if (!i) dates.splice(datePos,0,d);
    return prev * pyfy_exp(vol,drift,rnd,dt);
  }
};

function pyfy_exp(vol,drift,rnd,dt) {
  return Math.exp((drift-vol*vol/2)*dt+rnd*vol*Math.sqrt(dt));
}