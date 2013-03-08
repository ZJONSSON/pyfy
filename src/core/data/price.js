/*global pyfy,Data*/
pyfy.Price = Price;

pyfy.price = function(d) {
  return new Price(d);
};

function Price() {
  Data.apply(this,arguments);
}

Price.prototype = new Data();

Price.prototype._fn = function(d,prev,next) {
  if (next.x == prev.x) return prev;
  if (d < next.x) return {
    x:d,
    y:prev.y+(next.y-prev.y)*(d-prev.x)/(next.x-prev.x)
  };
};