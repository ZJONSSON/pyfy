/*global Base*/

function Data(d) {
 Base.apply(this,arguments);
 this.data = {};
 this._dates = [];
 if (d) this.update(d);
}

pyfy.Data = Data;

Data.prototype = new Base();

Data.prototype.rawDates = function(dates,ids) {
  dates = dates || {};
  ids = ids || {};
  if (!ids[this.ID]) {
    this._dates.forEach(function(e) { dates[e] = e;});
    ids[this.ID] = true;
  }
  return dates;
};

Data.prototype.update = function(a) {
  if (arguments.length === 0) return this;
  var self = this;
  if (!isNaN(a)) {
    var x = today();
    this.data[x] = {x:x,y:a};
  } else {
    if (a.length === undefined) a = [a];
    a.forEach(function(d) {
      self.data[d.x] = d;
    });
  }
  this._dates = Object.keys(this.data)
    .map(function(key) {
      return this.data[key].x;
    },this)
    .sort(ascending);
  return this;
};

Data.prototype.set = function(a) {
  this.data = {};
  return this.update(a);
};


Data.prototype.fn = function(cache,d,i) {
  var self = this,
      dates = this.dates(),
      prev = this.data[dates[0]],
      last = this.data[dates[dates.length-1]];

  cache[this.ID] = cache.__dates__.map(function(d) {
    if (!Object.keys(self.data).length) return {x:0,y:0};
    while (dates.length) {
      var next = self.data[dates[0]];
      if (d == next.x) return next;
      if (d < next.x) return self._fn(d,prev,next);
      prev = next;
      dates = dates.slice(1);
    }
    return last;
  });
  return cache[this.ID][i].y;
};

Data.prototype._fn = function(d,prev,next) {
  return undefined;
};