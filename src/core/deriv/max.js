pyfy.Max = Max;

function Max(d,max) {
  this.max = max || 0;
  Derived.call(this,d);
}

Max.prototype = new Derived();

Max.prototype.fn = function(cache,d,i) {
  return Math.max(this.parent.fetch(cache,d,i).y,this.max) ;
};