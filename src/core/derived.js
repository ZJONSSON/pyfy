/*global pyfy,Base*/

pyfy.Derived = Derived ;

function Derived(d,fn) {
  Base.call(this,arguments);
  this.parent = d || new Base();
  if (fn) this.fn = fn;
}

Derived.prototype = new Base();

Derived.prototype.inputs = function() {
  return this.parent;
};

Derived.prototype.rawDates = function(res) {
  return this.parent.rawDates(res);
}

Derived.prototype.fn= function(res,d) {
  return res.fetch(this.parent,d);
};

Derived.prototype.setParent = function(d) {
  this.parent = d;
  return this;
};
