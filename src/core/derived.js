/*global pyfy,Base*/

pyfy.derived = pyfy.Derived = Derived ;

function Derived(d) {
  if (!(this instanceof Derived))
    return new Derived(d,fn);
  Base.call(this,arguments);
  this.args.parent = d || new Base();

}

Derived.prototype = new Base();

Derived.prototype.fn= function(query,d,i) {
  return query.fetch(this.args.parent,d,i);
};


Derived.prototype.setParent = function(d) {
	this.args.parent = d;
}