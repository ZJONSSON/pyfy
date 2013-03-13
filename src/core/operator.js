/*global pyfy,Base,fetch*/
pyfy.Operator = Operator;

var ops = {
  add:function(a,b) { return a+b; },
  sub:function(a,b) { return a-b; },
  mul:function(a,b) { return a*b; },
  div:function(a,b) { return a/b; },
  pow:function(a,b) { return Math.pow(a,b); }
};

Object.keys(ops).forEach(function(op) {
  Base.prototype[op] = function(d) {
    return new Operator(op,this,d);
  };
});

function Operator(op,left,right) {
  Base.apply(this,arguments);
  this.left = left;
  this.right = right;
  this.op = op;
}

pyfy.Operator = Operator;

Operator.prototype = new Base();

Operator.prototype.inputs = function() {
  return [this.left,this.right];
};

Operator.prototype.fn = function(res,d,i) {
  var left,right;
  right = res.fetch(this.right,d);
  // We can bypass further evaluation if the right side is zero in a multiplication
  if (!right && this.op =="mul") return 0;
  left = res.fetch(this.left,d);
  return ops[this.op](left,right);
};