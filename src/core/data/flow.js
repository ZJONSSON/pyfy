/*global pyfy,Data*/
pyfy.flow = function(d) {
  return new Flow(d);
};

pyfy.Flow = Flow;

function Flow() {
 Data.apply(this,arguments);
}

Flow.prototype = new Data();

Flow.prototype.fn = function(query,d) {
  return this.data[d] || 0;
};
