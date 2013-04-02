/*global pyfy,Base*/

pyfy.const = function(value) {
  return new Const()
    .set("const",value || 0);
};

function Const() {
  Base.apply(this);
}

Const.prototype = new Base();

Const.prototype.fn = function() {
  return this.args.const;
};
