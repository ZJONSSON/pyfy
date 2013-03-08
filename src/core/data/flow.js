/*global pyfy,Data*/
pyfy.flow = function(d) {
  return new Flow(d);
};

pyfy.Flow = Flow;

function Flow() {
 Data.apply(this,arguments);
}

Flow.prototype = new Data();

Flow.prototype.fn = function(cache,d,i) {
  var self = this;
  cache[this.ID] = cache.__dates__.map(function(d) {
    return self.data[d] || {x:d,y:0};
  });
  return cache[this.ID][i].y;
};
