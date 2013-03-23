/*global pyfy,Derived*/

pyfy.call = Call;

function Call(d,strike) {
	if (!(this instanceof Call))
    return new Call(d);
  Derived.call(this,d);
  this.args.strike = strike || 0;
}

Call.prototype = new Derived();

Call.prototype.fn = function(query,d,i) {
  return Math.max(query.fetch(this.args.parent,d,i)-this.args.strike,0) ;
};