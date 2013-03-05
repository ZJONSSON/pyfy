/*global pyfy,Data*/

function Stock() {
  Data.apply(this,arguments);
}

pyfy.Stock = Stock;

pyfy.stock = function(d) {
  return new Stock(d);
};

Stock.prototype = new Data();

Stock.prototype.fn = function(cache,d,i) {
  var self = this;
  cache[this.ID] = cache.__dates__.map(function(d) {
    var i = self.sorted.length;
    while (i--) {
      if (self.sorted[i].x <= d) return {x:d,y:self.sorted[i].y};
    }
    return {x:d,y:0};
  });
  return cache[this.ID][i].y;
};

Stock.prototype.val = function(d) {
  var self = this;
  if (arguments.length === 0) return this.sorted;
  if (d.length === undefined) d = [d];

  return d.map(function(d) {
    var i = self.sorted.length;
    while (--i) {
      if (self.sorted[i].x <= d) return {x:d,y:self.sorted[i].y};
    }
    return self.sorted[0];
  });
};