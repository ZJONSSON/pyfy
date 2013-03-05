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

function Operator(op,parent,other) {
  Base.apply(this,arguments);
  this.parent = parent;
  this.other = other;
  this.op = op;
}

Operator.prototype = new Base();

Operator.prototype.inputs = function() {
  return [this.parent,this.other];
};

Operator.prototype.fn = function(cache,d,i) {
  var a = fetch(this.parent,cache,d,i),
      b = fetch(this.other,cache,d,i);
  return ops[this.op](a,b);
};