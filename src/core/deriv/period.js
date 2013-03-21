/*global pyfy,Derived*/

pyfy.period = Period;

function Period(d,start,fin) {
  if (!(this instanceof Period))
    return new Period(d,start,fin);
  Derived.call(this,d);
  this.args.start = start || -Infinity;
  this.args.fin = fin || Infinity;
}

Period.prototype = new Derived();

Period.prototype.rawDates = function(rawDates) {
  var res = {};
  if (rawDates)
    Object.keys(rawDates).forEach(function(key) {
      var d = rawDates[key];
      if (d>= this.args.start && d <= this.args.fin) res[d] = d;
    },this);
  return res;
};

Period.prototype.fn = function(query,d,i) {
  return (d >= this.args.start && d<= this.args.fin) ? query.fetch(this.args.parent,d,i) : 0;
};