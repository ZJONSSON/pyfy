/*global pyfy,Data*/

pyfy.stock = Stock;

function Stock(data,options) {
  if (!(this instanceof Stock))
    return new Stock(data,options);
  Data.apply(this,arguments);
}

Stock.prototype = new Data();

Stock.prototype._fn = function(d,last) {
  return this.args.data[last];
};