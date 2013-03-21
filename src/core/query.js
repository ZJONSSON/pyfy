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

// Init cache traverses the cache object upwards
// 

Query.prototype.initCache = function(obj) {
  if (!obj.ID) return false;

  var clear = (!this.cache[obj.ID] || this.cache[obj.ID].version != obj.version);

  if (obj.args) Object.keys(obj.args).forEach(function(key) {
    var parent = obj.args[key];
    if (this.initCache(parent)) clear = true;
    },this);

  if (clear) {
    this.cache[obj.ID] = {values:{},version:obj.version};
  }

  return clear;
};

Query.prototype.getCache = function(obj) {
  this.initCache(obj);
  return this.cache[obj.ID];
};

Query.prototype.dates = function(obj) {
  var cache = this.getCache(obj);
  if (!cache.dates) {
    var rawDates = this.rawDates(obj),
        dates = cache.dates = [];

    for (var date in rawDates) {
      dates.push(rawDates[date]);
    }

    dates.sort(ascending);
  }
  return cache.dates;
};

Query.prototype.rawDates = function(obj,rawDates) {
  var cache = this.getCache(obj);
  rawDates = rawDates || {};

  if (cache && !cache.rawDates) {
    if (obj.args) Object.keys(obj.args).forEach(function(key) {
      rawDates = this.rawDates(obj.args[key],rawDates);
    },this);
    // Finally we check to see if current object has inherit rawDates to contribute
    // This also gives current object the opportunity to overwrite rawDates so far (i.e. filter)
    if (obj.rawDates) rawDates = obj.rawDates(rawDates);
  }
  return rawDates;
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
  this.initCache(obj);
  if (!d) d = this.dates(obj);
  return [].concat(d).map(function(d) {
    return this.fetch(obj,d.valueOf());
  },this);
};

Query.prototype.fetch = function(obj,d) {
  if (!isNaN(obj)) return obj;  // in case it's a number
  var values = this.cache[obj.ID].values;

  if (values[d] === undefined) {
    var fn = obj.fn(this,d.valueOf());
    if (fn !== undefined) values[d] = fn;
  }
  return values[d];
};

