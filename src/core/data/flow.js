/*global pyfy,Data*/
pyfy.flow = Flow;

function Flow(data,options) {
  if (!(this instanceof Flow))
    return new Flow(data,options);
 Data.apply(this,arguments);
}

Flow.prototype = new Data();

Flow.prototype.fn = function(query,d) {
  return this.args.data[d] || 0;
};
