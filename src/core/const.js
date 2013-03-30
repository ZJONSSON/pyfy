/*global pyfy,Base*/

pyfy.const = Const;

function Const(data,options) {
  if (!(this instanceof Const))
    return new Const(data,options);
  Base.call(this);
  this.args.const = data || 0;
}

Const.prototype = new Base();

Const.prototype.fn = function() {
  return this.args.const;
};
