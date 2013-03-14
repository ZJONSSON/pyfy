/*global pyfy*/
pyfy.query = function(id,query) {
  query = query || new Query();
  query.cache[id] = query.cache[id] || {values:{}};
  query.cache[id].values = query.cache[id].values || {};
  return query;
};

function Query() {
  this.rawDates = {};
  this.cache = {};
}

Query.prototype.register = function(id) {
  if (!this.cache[id]) this.cache[id] = {};
};

Query.prototype.dates = function(obj) {
  var cache = this.cache[this.ID];
  if (!cache.dates) {
    cache.dates = [];
    for (var date in obj.rawDates(this)) {
      cache.dates.push(+rawDates[date])
    }
    cache.dates.sort(ascending);
  }
  return cache.dates;
};

Query.prototype.y = function(id) {
  if (typeof id === "object") id = id.ID;
  return this.dates.map(function(d) {
    return this.cache[id].values[d];
  },this);
};

Query.prototype.x = function() {
  if (typeof id === "object") id = id.ID;
  return this.dates.map(function(d) {
    return new Date(d);
  });
};

Query.prototype.val = function(id) {
  if (typeof id === "object") id = id.ID;
  return this.y(id).map(function(d,i) {
    return {x:new Date(this.dates[i]),y:d};
  },this);
};

Query.prototype.get = function(obj,d) {
  if (!d) d = obj.dates();
  return [].concat(d).map(function(d) {
    return this.fetch(obj,d);
  },this);
};

Query.prototype.fetch = function(obj,d) {
  if (!isNaN(obj)) return obj;
  if (!this.cache[obj.ID]) this.cache[obj.ID] = {values:{}};
  
  var values = this.cache[obj.ID].values;

  if (values[d] === undefined) {
    var fn = obj.fn(this,d);
    if (fn !== undefined) values[d] = fn;
  }
  return values[d];
};

