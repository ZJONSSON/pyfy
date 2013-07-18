/*global pyfy,Derived*/

pyfy.call = Put;

function Put(d,strike) {
	if (!(this instanceof Call))
    return new Put(d);
  Derived.call(this,d);
  this.args.strike = strike || 0;
}

Put.prototype = new Derived();

Put.prototype.fn = function(query,d,i) {
  return Math.max(this.args.strike - query.fetch(this.args.parent,d,i),0) ;
};