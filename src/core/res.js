/*global pyfy*/
pyfy.res = function(id,res) {
  res = res || new Res();
  res.cache[id] = res.cache[id] || {values:{}};
  res.cache[id].values = res.cache[id].values || {};
  return res;
};

function Res() {
  this.rawDates = {};
  this.cache = {};
}

Res.prototype.register = function(id) {
  if (!this.cache[id]) this.cache[id] = {};
};

Res.prototype.y = function(id) {
  if (typeof id === "object") id = id.ID;
  return this.dates.map(function(d) {
    return this.cache[id].values[d];
  },this);
};

Res.prototype.x = function() {
  if (typeof id === "object") id = id.ID;
  return this.dates.map(function(d) {
    return new Date(d);
  });
};

Res.prototype.val = function(id) {
  if (typeof id === "object") id = id.ID;
  return this.y(id).map(function(d,i) {
    return {x:new Date(this.dates[i]),y:d};
  },this);
};

Res.prototype.get = function(obj,d) {
  if (!d) d = obj.dates();
  return [].concat(d).map(function(d) {
    return this.fetch(obj,d);
  },this);
};

Res.prototype.fetch = function(obj,d) {
  if (!isNaN(obj)) return obj;
  if (!this.cache[obj.ID]) this.cache[obj.ID] = {values:{}};
  
  var values = this.cache[obj.ID].values;

  if (values[d] === undefined) {
    var fn = obj.fn(this,d);
    if (fn !== undefined) values[d] = fn;
  }
  return values[d];
};