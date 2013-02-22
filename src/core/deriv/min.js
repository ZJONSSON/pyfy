pyfy.Min = Min;

function Min(d,min) {
  this.min = min || 0;
  Derived.call(this,d);
}

Min.prototype = new Derived();

Min.prototype.fn = function(cache,d,i) {
  return Math.min(this.parent.fetch(cache,d,i).y,this.min);
};