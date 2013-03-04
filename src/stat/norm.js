/*global pyfy,Base*/

pyfy.norm = function(s,vol,r) {
  return new Norm(s,vol,r);
};

function rndNorm() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function Norm(s,r,vol) {
  Base.apply(this);
  this.s = s || 0;
  this.r = r || 0;
  this.vol = vol || 0;
}

Norm.prototype = new Base();

Norm.prototype.fn = function(cache,d,i) {
  var s = this.s,
      self = this,
      dates = cache.__dates__;
      
  cache[this.ID] = cache.__dt__.map(function(dt,i) {
    dt = dt / 365;
    var e = (self.r - Math.pow(self.vol,2)/2)*dt + self.vol*Math.sqrt(dt)*rndNorm();
    return {
      x:dates[i],
      y:s = s* Math.exp(e)
    };
  });
  return cache[this.ID][i];
};

