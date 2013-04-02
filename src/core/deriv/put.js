/*global pyfy,Derived*/

pyfy.call = Put;

function Put(parent,strike) {
	if (!(this instanceof Put))
    return new Put(parent);
  Base.call(this);
  this.args.parent = parent;
  this.args.strike = strike || 0;
}

Put.prototype = new Base();

Put.prototype.fn = function(query,d,i) {
  return Math.max(this.args.strike - query.fetch(this.args.parent,d,i),0) ;
};