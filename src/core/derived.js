/*global pyfy,Base*/

pyfy.Derived = Derived ;

function Derived(d,fn) {
  Base.call(this,arguments);
  this.parent = d;
  if (fn) this.fn = fn;
}

Derived.prototype = new Base();

Derived.prototype.inputs = function() {
  return this.parent;
};

Derived.prototype.fn= function(cache,d,i) {
  return this.parent ? this.parent.fetch(cache,d,i) : 0;
};

Derived.prototype.setParent = function(d) {
  this.parent = d;
  return this;
};
