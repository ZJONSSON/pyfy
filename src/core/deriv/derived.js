pyfy.Derived = Derived ;

function Derived(d,fn) {
  Base.call(this,arguments);
  this.parent = d;
  if (fn) this.fn = fn;
}

Derived.prototype = new Base();

Derived.prototype.rawDates = function() {
  return this.parent.rawDates.apply(this.parent,arguments);
};

Derived.prototype.fn= function(cache,d,i) {
  return this.parent.fetch(cache,d,i).y;
};

Derived.prototype.setParent = function(d) {
  this.parent = d;
  return this;
};
