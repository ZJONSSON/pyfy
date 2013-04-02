/*global pyfy,Derived*/

pyfy.period = function(parent,start,finish) {
  return new Period()
    .set("parent",parent)
    .set("start",start || -Infinity)
    .set("finish",finish || Infinity);
};

function Period() {
  Base.call(this);
}

Period.prototype = new Base();

Period.prototype.rawDates = function(rawDates) {
  var res = {};
  if (rawDates)
    Object.keys(rawDates).forEach(function(key) {
      var d = rawDates[key];
      if (d>= this.args.start && d <= this.args.finish) res[d] = d;
    },this);
  return res;
};

Period.prototype.fn = function(query,d,i) {
  return (d >= this.args.start && d<= this.args.finish) ? query.fetch(this.args.parent,d,i) : 0;
};