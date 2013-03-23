/*global pyfy,Base,ascending*/

pyfy.data = pyfy.Data = Data;

function Data(data,options) {
  if (!(this instanceof Data))
    return new Data(data,options);
  Base.apply(this,arguments);
  this.args.data = {};
  this._dates = [];
  if (data) this.update(data);
}

Data.prototype = new Base();

Data.prototype.rawDates = function(rawDates) {
  rawDates = rawDates || {};
  this._dates.forEach(function(e) {
    rawDates[e] = e;
  });
  return rawDates;
};

Data.prototype.update = function(a) {
  if (arguments.length === 0) return this;
  if (!isNaN(a)) {
    var x = pyfy.util.today().valueOf();
    this.args.data[x] = a;
  } else {
    [].concat(a)
      .forEach(function(d) {
        this.args.data[d.x.valueOf()] = d.y;
      },this);
  }
  this._dates = Object.keys(this.args.data)
    .map(function(key) {
      return +key;
    })
    .sort(ascending);
  return this;
};

Data.prototype.set = function(a) {
  this.args.data = {};
  return this.update(a);
};

Data.prototype.fn = function(query,d) {
  if (!Object.keys(this.args.data).length) return 0;
  if (this.args.data[d]) return this.args.data[d];

  var dates = query.dates(this),
      next = pyfy.util.bisect(dates,d),
      prev = next -1;

  if (next == dates.length) next-=1;
  if (next === 0) prev = 0;
  return this._fn(d,dates[prev] || dates[next],dates[next]);
};

Data.prototype._fn = function(d,prev,next) {
  return undefined;
};