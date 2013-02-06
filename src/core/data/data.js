function Data(d) {
 Base.apply(this,arguments);
 this.data = {};
 this.sorted = [];
 this._dates = [];
 if (d) this.update(d);
}

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
  this._dates = [];
  this.sorted = Object.keys(this.data).map(function(key) {
    var d = self.data[key];
    self._dates.push(d.x);
    return d;
  }).sort(ascending);
  return this;
};

Data.prototype.set = function(a) {
  this.data = {};
  return this.update(a);
};

