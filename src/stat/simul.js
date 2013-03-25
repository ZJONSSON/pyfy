/*global pyfy,Query*/

pyfy.simul = Simul;

function Simul(num) {
  if (!(this instanceof Simul))
    return new Simul(num);
  Query.call(this);
  this.num = num;
}

Simul.prototype = new Query();

Simul.prototype.fetch = function(obj,d,i) {
 if (!isNaN(obj)) return obj;  // in case it's a number
  var values = this.cache[obj.ID].values;
  values[d] = values[d] || [];

  if (values[d][i] === undefined) {
    var fn = obj.fn(this,d.valueOf(),i);
    if (fn !== undefined) values[d][i] = fn;
  }
  return values[d][i];
};

Simul.prototype.get = function(obj,dates) {
  this.initCache(obj);
  return [].concat(dates || this.dates(obj))
    .map(function(d) {
      var res = [], i = this.num;
      while(i--)
        res.push(this.fetch(obj,d.valueOf(),i));
      return res;
    },this);
};

