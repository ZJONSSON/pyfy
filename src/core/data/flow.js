/*global pyfy,Data*/
pyfy.flow = function(d) {
  return new Flow(d);
};

pyfy.Flow = Flow;

function Flow() {
 Data.apply(this,arguments);
}

Flow.prototype = new Data();

Flow.prototype.fn = function(res,d,i) {
  var self = this;
  res.cache[this.ID].values = res.dates.map(function(d) {
    return (self.data[d]) ? self.data[d].y : 0;
  });
  return res.cache[this.ID].values[i];
};
