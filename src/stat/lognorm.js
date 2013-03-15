/*global pyfy,Base*/

pyfy.logNorm = function(s,vol,r) {
  return new Norm(s,vol,r);
};


function logNorm(s,r,vol) {
  Wiener.apply(this);
  this.s = s || 0;
  this.r = r || 0;
  this.vol = vol || 0;
}

logNorm.prototype = new Wiener();

logNorm.prototype.inputs = function() {
  return [this.s,this.r,this.vol]
};

Norm.prototype.fn = function(query,d) {
  if (query.cache[this.ID].values.length == 0) {
    var d0 = new Date();
    query.cache[this.ID].values[d0] = s 
    query.fetch(this.parent,d0)
  };

  return vol*Math.sqrt(dt)*query.fetch(this.parent,d);
      
  var dt = (cache.dates[i] - (cache.dates[i-1] || cache.dates[0]))/365,
      s = (i>0)  ? this.fetch(cache,d,i-1) : this.s,
      r =   fetch(this.r,cache,d,i),
      vol =  fetch(this.vol,cache,d,i),
      e = (r - Math.pow(vol,2)/2)*dt + vol*Math.sqrt(dt)*rndNorm();
  return s * Math.exp(e);
};

