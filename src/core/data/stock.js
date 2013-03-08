/*global pyfy,Data*/

function Stock() {
  Data.apply(this,arguments);
}

pyfy.Stock = Stock;

pyfy.stock = function(d) {
  return new Stock(d);
};

Stock.prototype = new Data();

Stock.prototype._fn = function(d,last) {
  return last.y;
};