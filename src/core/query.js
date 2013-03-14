/*global pyfy,ascending*/
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

Query.prototype.getCache = function(obj) {
  return (this.cache[obj.ID]) || (this.cache[obj.ID] = {values : {}});
};

Query.prototype.dates = function(obj) {
  var cache = this.getCache(obj);
  if (!cache.dates) {
   cache.dates = obj.dates()
    .map(function(d) { return d.valueOf(); })
    .sort(ascending);
  }
  return cache.dates;
};

Query.prototype.y = function(obj,dates) {
  return this.get(obj,dates);
};

Query.prototype.x = function(obj) {
  return this.dates(obj).map(function(d) { return new Date(d); });
};

Query.prototype.val = function(id) {
  if (typeof id === "object") id = id.ID;
  return this.y(id).map(function(d,i) {
    return {x:new Date(this.dates[i]),y:d};
  },this);
};

Query.prototype.get = function(obj,d) {
  if (!d) d = this.dates(obj);
  return [].concat(d).map(function(d) {
    return this.fetch(obj,d.valueOf());
  },this);
};

Query.prototype.fetch = function(obj,d) {
  if (!isNaN(obj)) return obj;  // in case it's a number
  var values = this.getCache(obj).values; 

  if (values[d] === undefined) {
    var fn = obj.fn(this,d.valueOf());
    if (fn !== undefined) values[d] = fn;
  }
  return values[d];
};

