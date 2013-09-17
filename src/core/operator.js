/*global pyfy,Base*/
pyfy.operator = pyfy.Operator = Operator;

var ops = {
  add:function(a,b) { return a+b; },
  sub:function(a,b) { return a-b; },
  mul:function(a,b) { return a*b; },
  div:function(a,b) { return a/b; },
  pow:function(a,b) { return Math.pow(a,b); },
  gt:function(a,b) { return (a>b)*1; },
  lt:function(a,b) { return (a<b)*1; }
};

Object.keys(ops).forEach(function(op) {
  Base.prototype[op] = function(d) {
    return new Operator(op,this,d);
  };
});

function Operator(op,left,right) {
  if (!(this instanceof Operator))
    return new Operator(op,left,right);

  Base.apply(this);
  this.args.left = left;
  this.args.right = right;
  this.op = op;
}

Operator.prototype = new Base();

Operator.prototype.fn = function(query,d,i) {
  var left,right;
  right = query.fetch(this.args.right,d,i);
  // We can bypass further evaluation if the right side is zero in a multiplication
  if (!right && this.op =="mul") return 0;
  left = query.fetch(this.args.left,d,i);
  return ops[this.op](left,right);
};