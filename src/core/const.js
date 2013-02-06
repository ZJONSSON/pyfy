pyfy.const = pyfy.c = function(d) {
  return new Const(d);
};

function Const(d) {
  this.const = d;
}

Const.prototype = new Base();

Const.prototype.fn = function() {
  return this.const;
};