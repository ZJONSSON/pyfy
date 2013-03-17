/*global pyfy,Base*/

pyfy.derived = pyfy.Derived = Derived ;

function Derived(d,fn) {
  if (!(this instanceof Derived))
    return new Derived(d,fn);
  Base.call(this,arguments);
  this.parent = d || new Base();
  if (fn) this.fn = fn;
}

Derived.prototype = new Base();

Derived.prototype.inputs = function() {
  return this.parent;
};


Derived.prototype.fn= function(query,d) {
  return query.fetch(this.parent,d);
};

Derived.prototype.setParent = function(d) {
  this.parent = d;
  return this;
};
