
pyfy.call = Call;

function Call(parent,strike) {
	if (!(this instanceof Call))
    return new Call(parent);
  Base.call(this);
  this.args.parent = parent;
  this.args.strike = strike || 0;
}

Call.prototype = new Base();

Call.prototype.fn = function(query,d,i) {
  return Math.max(query.fetch(this.args.parent,d,i)-this.args.strike,0) ;
};