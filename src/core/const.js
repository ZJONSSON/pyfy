/*global pyfy,Base*/

function Const(d) {
  this.const = d;
}

pyfy.const = pyfy.c = function(d) {
  Base.apply(this,arguments);
  return new Const(d);
};

Const.prototype = new Base();

Const.prototype.fn = function() {
  return this.const;
};

Const.prototype.update = Const.prototype.set = function(d) {
  this.const = d;
  return this;
};