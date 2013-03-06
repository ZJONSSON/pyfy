/*global pyfy,Base*/
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

Operator.prototype = new Base();

Operator.prototype.inputs = function() {
  return [this.left,this.right];
};

Operator.prototype.fn = function(cache,d,i) {
  var left,right;
  right = fetch(this.right,cache,d,i);
  // We can bypass further evaluation if the right side is zero in a multiplication
  if (!right && this.op =="mul") return 0;
  left = fetch(this.left,cache,d,i);
  return ops[this.op](left,right);
};