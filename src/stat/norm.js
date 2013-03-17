/*global pyfy,Base*/

pyfy.norm = Norm;

function rndNorm() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function Norm(s,r,vol) {
  if (!(this instanceof Norm))
    return new Norm(s,r,vol);

  Base.apply(this);
  this.s = s || 0;
  this.r = r || 0;
  this.vol = vol || 0;
}

Norm.prototype = new Base();

Norm.prototype.inputs = function() {
  return [this.s,this.r,this.vol]
};

Norm.prototype.fn = function(cache,d,i) {
  var s = this.s,
      self = this,
      dates = cache.__dates__;
      
  var dt = (cache.dates[i] - (cache.dates[i-1] || cache.dates[0]))/365,
      s = (i>0)  ? this.fetch(cache,d,i-1) : this.s,
      r =   fetch(this.r,cache,d,i),
      vol =  fetch(this.vol,cache,d,i),
      e = (r - Math.pow(vol,2)/2)*dt + vol*Math.sqrt(dt)*rndNorm();
  return s * Math.exp(e);
};

