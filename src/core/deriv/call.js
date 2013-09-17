Base.register("call");

pyfy.call = function(parent,strike) {
  return new Call()
    .set("parent",parent)
    .set("strike",strike);
};

function Call() {
  Base.call(this);
}

Call.prototype = new Base();

Call.prototype.fn = function(query,d,i) {
  return Math.max(query.fetch(this.args.parent,d,i)-this.args.strike,0) ;
};