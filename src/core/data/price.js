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
  var prevVal = this.data[prev],
    nextVal = this.data[next];

  if (prev == next) return nextVal;

  return (prev < d < next)
    ? prevVal+(nextVal-prevVal)*(d-prev)/(next-prev)
    : nextVal;
};