/*global pyfy,ascending*/

pyfy.Query = Query;

pyfy.query = function(id,query) {
  query = query || new Query();
  if (id) {
    query.cache[id] = query.cache[id] || {values:{}};
    query.cache[id].values = query.cache[id].values || {};
  }
  return query;
};

function Query() {
  if (!(this instanceof Query))
    return new Query();
  this.cache = {};
}

Query.prototype.getCache = function(obj) {
  return (this.cache[obj.ID]) || (this.cache[obj.ID] = {values : {}});
};

Query.prototype.dates = function(obj) {
  var cache = this.getCache(obj);
  if (!cache.dates) {
    var rawDates = obj.rawDates(this),
        dates = cache.dates = [];

    for (var date in rawDates) {
      dates.push(rawDates[date]);
    }
    dates.sort(ascending);
  }
  return cache.dates;
};

Query.prototype.y = function(obj,dates) {
  return this.get(obj,dates);
};

Query.prototype.x = function(obj) {
  return this.dates(obj).map(function(d) { return new Date(d); });
};

Query.prototype.val = function(obj,dates) {
  dates = dates || this.dates(obj);
  dates = [].concat(dates);
   return this.get(obj,dates).map(function(d,i) {
    return {x:new Date(dates[i]),y:d};
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

