function Res(id) {
  this.rawDates = {};
  this.cache = {};
  this.cache[id] = {values:[]}
}

Res.prototype.register = function(id) {
  if (!this.cache[id]) this.cache[id] = {};
};

Res.prototype.y = function(id) {
  return this.cache[id].values;
};

Res.prototype.x = function() {
  return this.dates;
};

Res.prototype.val = function(id) {
  return this.y(id).map(function(d,i) {
    return {x:this.dates[i],y:d};
  },this);
};