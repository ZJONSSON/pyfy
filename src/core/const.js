/*global pyfy,Base*/

pyfy.const = Const;

function Const(data,options) {
  if (!(this instanceof Const))
    return new Const(data,options);
  this.const = data || 0;
}

Const.prototype = new Base();

Const.prototype.fn = function() {
  return this.const;
};

Const.prototype.update = Const.prototype.set = function(d) {
  this.const = d;
  return this;
};