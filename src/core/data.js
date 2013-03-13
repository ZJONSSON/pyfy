/*global pyfy,Base,ascending*/

function Data(d) {
 Base.apply(this,arguments);
 this.data = {};
 this._dates = [];
 if (d) this.update(d);
}

pyfy.Data = Data;

Data.prototype = new Base();

Data.prototype.rawDates = function(res) {
  res = pyfy.res(this.ID,res)
  var cache = res.cache[this.ID];

  if (!cache.rawDates) {
    cache.rawDates = {};
    this._dates.forEach(function(e) {
      cache.rawDates[e] = e;
    });
  }

  return cache.rawDates;
};

Data.prototype.update = function(a) {
  if (arguments.length === 0) return this;
  if (!isNaN(a)) {
    var x = pyfy.util.today().valueOf();
    this.data[x] = a;
  } else {
    [].concat(a)
      .forEach(function(d) {
        this.data[d.x.valueOf()] = d.y;
      },this);
  }
  this._dates = Object.keys(this.data)
    .map(function(key) {
      return +key;
    })
    .sort(ascending);
  return this;
};

Data.prototype.set = function(a) {
  this.data = {};
  return this.update(a);
};

Data.prototype.fn = function(res,d) {
  if (!Object.keys(this.data).length) return 0;
  if (this.data[d]) return this.data[d];

  var dates = this.dates(),
      next = pyfy.util.bisect(dates,d),
      prev = next -1;

  if (next == dates.length) next-=1;
  if (next === 0) prev = 0;
  return this._fn(d,dates[prev] || dates[next],dates[next]);
};

Data.prototype._fn = function(d,prev,next) {
  return undefined;
};