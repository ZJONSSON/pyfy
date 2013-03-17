/*global pyfy,Derived*/

pyfy.max = Max;

function Max(d,max) {
	if (!(this instanceof Max))
    return new Max(d,max);
  Derived.call(this,d);
  this.max = max || 0;
}

Max.prototype = new Derived();

Max.prototype.fn = function(query,d) {
  return Math.max(query.fetch(this.parent,d),this.max) ;
};