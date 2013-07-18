/*global pyfy,Data*/
pyfy.price = Price;

function Price(data,options) {
  if (!(this instanceof Price))
    return new Price(data,options);
  Data.apply(this,arguments);
}

Price.prototype = new Data();

Price.prototype._fn = function(d,prev,next) {
  var prevVal = this.args.data[prev],
    nextVal = this.args.data[next];

  if (prev == next) return nextVal;

  return (prev < d < next)
    ? prevVal+(nextVal-prevVal)*(d-prev)/(next-prev)
    : nextVal;
};