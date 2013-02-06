pyfy.Price = Price;
pyfy.price = function(d) {
  return new Price(d);
};

function Price() {
  Data.apply(this,arguments);
}

Price.prototype = new Data();

Price.prototype.fn = function(cache,d,i) {
  var self = this;
  cache[this.ID] = cache.__dates__.map(function(d) {
    var i = self.sorted.length,
        last=self.sorted[self.sorted.length-1];

    while (i--) {
      var next = self.sorted[i];
      if (next.x <= d) return {
        x:d,
        y:next.y+(last.y-next.y)*(d-next.x)/(next.x-last.x)
      };
      last = next;
    }
    return {x:d,y:0};
  });
  return cache[this.ID][i];
};