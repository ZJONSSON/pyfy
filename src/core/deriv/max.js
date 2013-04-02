/*global pyfy,Derived*/

pyfy.max = Max;

function Max(parent,max) {
	if (!(this instanceof Max))
    return new Max(parent,max);
  Base.call(this);
  this.args.parent = parent;
  this.args.max = max || 0;
}

Max.prototype = new Base();

Max.prototype.fn = function(query,d,i) {
  return Math.max(query.fetch(this.args.parent,d,i),this.args.max) ;
};