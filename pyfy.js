/**
  * pyfy.js (c) 2008-2013 Sigurgeir Orn Jonsson (ziggy.jonsson.nyc@gmail.com)
  * @license http://creativecommons.org/licenses/by-nc-sa/3.0/
  * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
  */
(function() {
  var pyfy = this.pyfy = {};
  if (typeof module !== "undefined") module.exports = pyfy;
  pyfy.util = {};
  pyfy.util.DAYMS = 1e3 * 60 * 60 * 24;
  pyfy.util.dateParts = function(d) {
    d = new Date(d);
    var query = {
      y: d.getFullYear(),
      m: d.getMonth(),
      d: d.getDate()
    };
    query.date = new Date(query.y, query.m, query.d);
    query.lastofMonth = new Date(query.y, query.m, query.d + 1).getMonth() == query.m + 1;
    query.lastFeb = query.m == 2 && query.lastofMonth;
    return query;
  };
  pyfy.util.today = function() {
    return pyfy.util.dateParts(new Date()).date;
  };
  pyfy.util.nextDay = function(d, i) {
    if (i === undefined) i = 0;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
  };
  pyfy.util.nextWeekday = function(date, weekday) {
    var currentWeekday = date.getDay();
    var dt = currentWeekday > weekday ? weekday + 7 - currentWeekday : weekday - currentWeekday;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + dt);
  };
  function ascending(a, b) {
    return +a - b;
  }
  function f(d) {
    return d;
  }
  pyfy.util.bisect = function(a, x, lo, hi) {
    if (arguments.length < 3) lo = 0;
    if (arguments.length < 4) hi = a.length;
    while (lo < hi) {
      var mid = lo + hi >>> 1;
      if (f.call(a, a[mid], mid) < x) lo = mid + 1; else hi = mid;
    }
    return lo;
  };
  pyfy.calendar = {};
  pyfy.calendar.weekday = function(d) {
    var weekday = d.getDay();
    return weekday !== 0 && weekday != 6;
  };
  pyfy.calendar.easter = function(date, dt) {
    dt = dt || [ 1, -2 ];
    var y, c, n, k, i, j, l, m, d;
    if (1 < date.getMonth() < 4) {
      y = date.getFullYear();
      c = ~~(y / 100);
      n = y - 19 * ~~(y / 19);
      k = ~~((c - 17) / 25);
      i = c - ~~(c / 4) - ~~((c - k) / 3) + 19 * n + 15;
      i = i - 30 * ~~(i / 30);
      i = i - i / 28 * (1 - ~~(i / 28) * ~~(29 / (i + 1)) * ~~((21 - n) / 11));
      j = y + ~~(y / 4) + i + 2 - c + ~~(c / 4);
      j = j - 7 * ~~(j / 7);
      l = i - j;
      m = 3 + ~~((l + 40) / 44) - 1;
      d = Math.round(l + 28 - 31 * ~~(m / 4));
      return dt.every(function(dt) {
        return date - new Date(y, m, d + dt);
      });
    }
    return true;
  };
  pyfy.calendar.target = function(date) {
    var m = date.getMonth(), d = date.getDate();
    return pyfy.calendar.weekday(date) && pyfy.calendar.easter(date, [ +1, -2 ]) && !(m === 0 && d == 1) && !(m == 11 && (d == 26 || d == 25)) && !(m == 4 && d == 1);
  };
  pyfy.calendar.is = function(date) {
    var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    return pyfy.calendar.weekday(date) && pyfy.calendar.easter(date, [ +1, -2, -3, +39, 50 ]) && !(m == 5 && d == 17) && !(m === 0 && d == 1) && !(m == 11 && (d == 26 || d == 25)) && !(m == 4 && d == 1) && !(m == 7 && date - pyfy.util.nextWeekday(new Date(y, 7, 1), 1) === 0) && !(m == 3 && date - pyfy.util.nextWeekday(new Date(y, 3, 19), 4) === 0);
  };
  pyfy.Query = Query;
  pyfy.query = function(id, query) {
    query = query || new Query();
    if (id) {
      query.cache[id] = query.cache[id] || {
        values: {}
      };
      query.cache[id].values = query.cache[id].values || {};
    }
    return query;
  };
  function Query() {
    if (!(this instanceof Query)) return new Query();
    this.cache = {};
  }
  Query.prototype.initCache = function(obj) {
    if (!obj.ID) return false;
    var clear = !this.cache[obj.ID] || this.cache[obj.ID].version != obj.version;
    if (obj.args) Object.keys(obj.args).forEach(function(key) {
      var parent = obj.args[key];
      if (this.initCache(parent)) clear = true;
    }, this);
    if (clear) {
      this.cache[obj.ID] = {
        values: {},
        version: obj.version
      };
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
      var rawDates = this.rawDates(obj), dates = cache.dates = [];
      for (var date in rawDates) {
        dates.push(rawDates[date]);
      }
      dates.sort(ascending);
    }
    return cache.dates;
  };
  Query.prototype.rawDates = function(obj, rawDates) {
    var cache = this.getCache(obj);
    rawDates = rawDates || {};
    if (cache && !cache.rawDates) {
      if (obj.args) Object.keys(obj.args).forEach(function(key) {
        rawDates = this.rawDates(obj.args[key], rawDates);
      }, this);
      if (obj.rawDates) rawDates = obj.rawDates(rawDates);
    }
    return rawDates;
  };
  Query.prototype.y = function(obj, dates) {
    return this.get(obj, dates);
  };
  Query.prototype.x = function(obj) {
    return this.dates(obj).map(function(d) {
      return new Date(d);
    });
  };
  Query.prototype.val = function(obj, dates) {
    dates = dates || this.dates(obj);
    dates = [].concat(dates);
    return this.get(obj, dates).map(function(d, i) {
      return {
        x: new Date(dates[i]),
        y: d
      };
    }, this);
  };
  Query.prototype.get = function(obj, d) {
    this.initCache(obj);
    if (!d) d = this.dates(obj);
    return [].concat(d).map(function(d) {
      return this.fetch(obj, d.valueOf());
    }, this);
  };
  Query.prototype.fetch = function(obj, d) {
    if (!isNaN(obj)) return obj;
    var values = this.cache[obj.ID].values;
    if (values[d] === undefined) {
      var fn = obj.fn(this, d.valueOf());
      if (fn !== undefined) values[d] = fn;
    }
    return values[d];
  };
  var ID = 0;
  pyfy.base = pyfy.Base = Base;
  function Base() {
    if (!(this instanceof Base)) return new Base();
    this.ID = ID++;
    this.args = {};
    this.version = 0;
  }
  Base.prototype.arg = function(d, v) {
    this.args[d] = v;
    this.version += 1;
  };
  Base.prototype.fn = function() {
    return 0;
  };
  Base.prototype.rawDates = undefined;
  [ Cumul, Diff, Prev, Max, Min, Neg, Calendar, Dcf, Period, Derived ].forEach(function(Fn) {
    Base.prototype[Fn.name.toLowerCase()] = function(a, b, c) {
      return new Fn(this, a, b, c);
    };
  });
  Base.prototype.pv = function(curve) {
    var pv = 0;
    if (!isNaN(curve)) curve = pyfy.ir(curve);
    this.mul(curve.df).y().forEach(function(cf) {
      pv += cf;
    });
    return pv;
  };
  Base.prototype.y = function(dates) {
    return pyfy.query().get(this, dates);
  };
  Base.prototype.x = function(dates) {
    return pyfy.query().x(this, dates);
  };
  Base.prototype.val = function(dates) {
    return pyfy.query().val(this, dates);
  };
  Base.prototype.dates = function() {
    return pyfy.query().dates(this).map(function(d) {
      return new Date(d);
    });
  };
  pyfy.const = Const;
  function Const(data, options) {
    if (!(this instanceof Const)) return new Const(data, options);
    Base.call(this);
    this.args.const = data || 0;
  }
  Const.prototype = new Base();
  Const.prototype.fn = function() {
    return this.args.const;
  };
  Const.prototype.update = Const.prototype.set = function(d) {
    this.args.const = d;
    return this;
  };
  pyfy.sum = Sum;
  function Sum(a, b, c, d, e, f, g, h) {
    if (!(this instanceof Sum)) return new Sum(a, b, c, d, e, f, g, h);
    Base.call(this);
    Array.prototype.slice.call(arguments).map(function(d, i) {
      if (d) this.args[i] = d;
    }, this);
  }
  Sum.prototype = new Base();
  Sum.prototype.fn = function(query, d, i) {
    var sum = 0;
    Object.keys(this.args).forEach(function(key) {
      sum += query.fetch(this.args[key], d, i);
    }, this);
    return sum;
  };
  pyfy.data = pyfy.Data = Data;
  function Data(data, options) {
    if (!(this instanceof Data)) return new Data(data, options);
    Base.apply(this, arguments);
    this.args.data = {};
    this._dates = [];
    if (data) this.update(data);
  }
  Data.prototype = new Base();
  Data.prototype.rawDates = function(rawDates) {
    rawDates = rawDates || {};
    this._dates.forEach(function(e) {
      rawDates[e] = e;
    });
    return rawDates;
  };
  Data.prototype.update = function(a) {
    if (arguments.length === 0) return this;
    if (!isNaN(a)) {
      var x = pyfy.util.today().valueOf();
      this.args.data[x] = a;
    } else {
      [].concat(a).forEach(function(d) {
        this.args.data[d.x.valueOf()] = d.y;
      }, this);
    }
    this._dates = Object.keys(this.args.data).map(function(key) {
      return +key;
    }).sort(ascending);
    return this;
  };
  Data.prototype.set = function(a) {
    this.args.data = {};
    return this.update(a);
  };
  Data.prototype.fn = function(query, d) {
    if (!Object.keys(this.args.data).length) return 0;
    if (this.args.data[d]) return this.args.data[d];
    var dates = query.dates(this), next = pyfy.util.bisect(dates, d), prev = next - 1;
    if (next == dates.length) next -= 1;
    if (next === 0) prev = 0;
    return this._fn(d, dates[prev] || dates[next], dates[next]);
  };
  Data.prototype._fn = function(d, prev, next) {
    return undefined;
  };
  pyfy.flow = Flow;
  function Flow(data, options) {
    if (!(this instanceof Flow)) return new Flow(data, options);
    Data.apply(this, arguments);
  }
  Flow.prototype = new Data();
  Flow.prototype.fn = function(query, d) {
    return this.args.data[d] || 0;
  };
  pyfy.stock = Stock;
  function Stock(data, options) {
    if (!(this instanceof Stock)) return new Stock(data, options);
    Data.apply(this, arguments);
  }
  Stock.prototype = new Data();
  Stock.prototype._fn = function(d, last) {
    return this.args.data[last];
  };
  pyfy.price = Price;
  function Price(data, options) {
    if (!(this instanceof Price)) return new Price(data, options);
    Data.apply(this, arguments);
  }
  Price.prototype = new Data();
  Price.prototype._fn = function(d, prev, next) {
    var prevVal = this.args.data[prev], nextVal = this.args.data[next];
    if (prev == next) return nextVal;
    return prev < d < next ? prevVal + (nextVal - prevVal) * (d - prev) / (next - prev) : nextVal;
  };
  pyfy.stream = Stream;
  function Stream(data, options) {
    if (!(this instanceof Stream)) return new Stream(data, options);
    Data.apply(this, arguments);
  }
  Stream.prototype = new Data();
  pyfy.interval = function(start, dm, no, val) {
    start = start || pyfy.util.today();
    var interval = [];
    for (var i = 0; i < no + 1; i++) {
      interval.push({
        x: new Date(start.getFullYear(), start.getMonth() + i * dm, start.getDate()),
        y: !i ? 0 : val || 1
      });
    }
    return pyfy.flow(interval);
  };
  pyfy.derived = pyfy.Derived = Derived;
  function Derived(d) {
    if (!(this instanceof Derived)) return new Derived(d, fn);
    Base.call(this, arguments);
    this.args.parent = d || new Base();
  }
  Derived.prototype = new Base();
  Derived.prototype.fn = function(query, d, i) {
    return query.fetch(this.args.parent, d, i);
  };
  Derived.prototype.setParent = function(d) {
    this.args.parent = d;
  };
  pyfy.period = Period;
  function Period(d, start, fin) {
    if (!(this instanceof Period)) return new Period(d, start, fin);
    Derived.call(this, d);
    this.args.start = start || -Infinity;
    this.args.fin = fin || Infinity;
  }
  Period.prototype = new Derived();
  Period.prototype.rawDates = function(rawDates) {
    var res = {};
    if (rawDates) Object.keys(rawDates).forEach(function(key) {
      var d = rawDates[key];
      if (d >= this.args.start && d <= this.args.fin) res[d] = d;
    }, this);
    return res;
  };
  Period.prototype.fn = function(query, d, i) {
    return d >= this.args.start && d <= this.args.fin ? query.fetch(this.args.parent, d, i) : 0;
  };
  pyfy.prev = Prev;
  function Prev(d, start) {
    if (!(this instanceof Prev)) return new Prev(d, start);
    Derived.call(this, d);
    this.default = start || 0;
  }
  Prev.prototype = new Derived();
  Prev.prototype.fn = function(query, d, i) {
    var dates = query.dates(this), datePos = pyfy.util.bisect(dates, d);
    return datePos > 0 ? query.fetch(this.args.parent, dates[datePos - 1], i) : this.default;
  };
  pyfy.cumul = Cumul;
  function Cumul(d) {
    if (!(this instanceof Cumul)) return new Cumul(d);
    Derived.call(this, d);
  }
  Cumul.prototype = new Derived();
  Cumul.prototype.fn = function(query, d, i) {
    var dates = query.dates(this), datePos = pyfy.util.bisect(dates, d);
    return query.fetch(this.args.parent, d, i) + (datePos ? query.fetch(this, dates[datePos - 1], i) : 0);
  };
  pyfy.diff = Diff;
  function Diff(d) {
    if (!(this instanceof Diff)) return new Diff();
    Derived.call(this, d);
  }
  Diff.prototype = new Derived();
  Diff.prototype.fn = function(query, d, i) {
    var dates = query.dates(this), datePos = pyfy.util.bisect(dates, d);
    return datePos ? query.fetch(this.args.parent, d, i) - query.fetch(this.args.parent, dates[datePos - 1], i) : 0;
  };
  pyfy.max = Max;
  function Max(d, max) {
    if (!(this instanceof Max)) return new Max(d, max);
    Derived.call(this, d);
    this.args.max = max || 0;
  }
  Max.prototype = new Derived();
  Max.prototype.fn = function(query, d, i) {
    return Math.max(query.fetch(this.args.parent, d, i), this.args.max);
  };
  pyfy.min = Min;
  function Min(d, min) {
    if (!(this instanceof Min)) return new Min(d, min);
    Derived.call(this, d);
    this.args.min = min || 0;
  }
  Min.prototype = new Derived();
  Min.prototype.fn = function(query, d, i) {
    return Math.min(query.fetch(this.args.parent, d, i), this.args.min);
  };
  pyfy.Neg = Neg;
  function Neg(d) {
    if (!(this instanceof Neg)) return new Neg();
    Derived.call(this, d);
  }
  Neg.prototype = new Derived();
  Neg.prototype.fn = function(query, d, i) {
    return -query.fetch(this.args.parent, d, i);
  };
  pyfy.acct = Acct;
  function Acct(d) {
    if (!(this instanceof Acct)) return new Acct(d);
    Derived.call(this, d);
    this.args.start = d || 0;
  }
  Acct.prototype = new Derived();
  Acct.prototype.fn = function(query, d, i) {
    var dates = query.dates(this.args.parent), pos = pyfy.util.bisect(dates, d);
    if (pos < 1) return this.start;
    if (dates[pos] == d) return query.fetch(this, dates[pos - 1], i) + query.fetch(this.args.parent, d, i);
    return query.fetch(this, dates[pos - 1], i);
  };
  pyfy.Calendar = Calendar;
  function Calendar(d, calendar) {
    if (!(this instanceof Calendar)) return new Calendar(d, calendar);
    Derived.call(this, d);
    this.args.calendar = calendar || pyfy.calendar.weekday;
  }
  Calendar.prototype = new Derived();
  Calendar.prototype.rawDates = function(query) {
    query = pyfy.query(this.ID, query);
    var cache = query.cache[this.ID];
    cache.dateMap = {};
    cache.rawDates = {};
    for (var pd in this.args.parent.rawDates(query)) {
      var date = new Date(+pd), calendar = [].concat(this.args.calendar), i = 0;
      while (!calendar.every(function(d) {
        var fn = typeof d === "string" ? pyfy.calendar[d] : d;
        return fn(date);
      }, this)) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        if (i++ > 31) throw "Calendar function always returns false";
      }
      date = date.valueOf();
      cache.rawDates[date] = +date;
      cache.dateMap[date] = +pd;
    }
    return cache.rawDates;
  };
  Calendar.prototype.fn = function(query, d) {
    var cache = query.cache[this.ID];
    return query.fetch(this.args.parent, cache.dateMap[d] || this.calendar(d));
  };
  Calendar.prototype.calendar = pyfy.calendar.weekday;
  pyfy.operator = pyfy.Operator = Operator;
  var ops = {
    add: function(a, b) {
      return a + b;
    },
    sub: function(a, b) {
      return a - b;
    },
    mul: function(a, b) {
      return a * b;
    },
    div: function(a, b) {
      return a / b;
    },
    pow: function(a, b) {
      return Math.pow(a, b);
    }
  };
  Object.keys(ops).forEach(function(op) {
    Base.prototype[op] = function(d) {
      return new Operator(op, this, d);
    };
  });
  function Operator(op, left, right) {
    if (!(this instanceof Operator)) return new Operator(op, left, right);
    Base.apply(this);
    this.args.left = left;
    this.args.right = right;
    this.op = op;
  }
  Operator.prototype = new Base();
  Operator.prototype.fn = function(query, d, i) {
    var left, right;
    right = query.fetch(this.args.right, d, i);
    if (!right && this.op == "mul") return 0;
    left = query.fetch(this.args.left, d, i);
    return ops[this.op](left, right);
  };
  pyfy.daycount = pyfy.daycount || {};
  pyfy.daycount.d_30_360 = function(d1, d2) {
    if (d1.d == 31) d1.d = 30;
    if (d1.d == 30 && d2.d == 31) d2.d = 30;
    return (360 * (d2.y - d1.y) + 30 * (d2.m - d1.m) + (d2.d - d1.d)) / 360;
  };
  pyfy.daycount.d_30E_360 = function(d1, d2) {
    if (d1.d == 31) d1.d = 30;
    if (d2.d == 31) d2.d = 30;
    return (360 * (d2.y - d1.y) + 30 * (d2.m - d1.m) + (d2.d - d1.d)) / 360;
  };
  pyfy.daycount.d_30_360US = function(d1, d2) {
    if (d1.lastofFeb && d2.lastofFeb) d2.d = 30;
    if (d1.lastofFeb) d1.d = 30;
    if (d2.d == 31 && (d1.d == 30 || d1.d == 31)) d2.d = 30;
    if (d1.d == 31) d1.d = 30;
    return (360 * (d2.y - d1.y) + 30 * (d2.m - d1.m) + (d2.d - d1.d)) / 360;
  };
  pyfy.daycount.d_act_360 = function(d1, d2) {
    return Math.round((d2.date - d1.date) / pyfy.util.DAYMS) / 360;
  };
  pyfy.daycount.d_act_act = function(d1, d2) {
    var dct = 0, _d1 = d1.date, _d2 = new Date(Math.min(new Date(_d1.getFullYear() + 1, 0, 1), d2.date));
    while (_d1 < d2.date) {
      var testDate = new Date(_d1.getFullYear(), 1, 29), denom = testDate.getDate() == 29 ? 366 : 365;
      dct += Math.round((_d2 - _d1) / pyfy.util.DAYMS) / denom;
      _d1 = _d2;
      _d2 = new Date(Math.min(new Date(_d1.getFullYear() + 1, 0, 1), d2.date));
    }
    return dct;
  };
  pyfy.dcf = Dcf;
  function Dcf(parent, daycount) {
    if (!(this instanceof Dcf)) return new Operator(parent, daycount);
    Derived.call(this, parent);
    if (daycount !== undefined) this.setDaycount(daycount);
  }
  Dcf.prototype = new Derived();
  Dcf.prototype.fn = function(query, d) {
    var cache = query.cache[this.ID];
    if (!Object.keys(cache.values).length) {
      var dates = query.dates(this);
      cache.values = {};
      dates.slice(1).forEach(function(d, i) {
        var d1 = pyfy.util.dateParts(dates[i]), d2 = pyfy.util.dateParts(d);
        cache.values[d] = dates[i] ? this.daycount(d1, d2) : 0;
      }, this);
    }
    return cache.values[d] || 0;
  };
  Dcf.prototype.daycount = pyfy.daycount.d_30_360;
  Dcf.prototype.setDaycount = function(d) {
    this.daycount = typeof d === "string" ? pyfy.daycount[d] : d;
    return this;
  };
  pyfy.ir = Ir;
  function Ir(data, options) {
    if (!(this instanceof Ir)) return new Ir(data, options);
    Stock.apply(this, arguments);
    this.df = new Df(this);
    this.args.daycount = pyfy.daycount.d_30_360;
  }
  Ir.prototype = new Stock();
  Ir.prototype.setDaycount = function(d) {
    this.args.daycount = typeof d === "string" ? pyfy.daycount[d] : d;
    return this;
  };
  Ir.prototype._fn = function(d, last, next) {
    return this.args.data[next];
  };
  pyfy.df = function(d) {
    return new Derived(d);
  };
  function Df(d, val) {
    Derived.call(this, d);
    this.args.val = val;
  }
  Df.prototype = new Dcf();
  Df.prototype.fn = function(query, d, i) {
    var dates = query.dates(this);
    var pos = pyfy.util.bisect(dates, d);
    var last = dates[pos - 1];
    if (!last) return d == dates[pos] ? 1 : 0;
    var dcf = this.parent.daycount(pyfy.util.dateParts(last), pyfy.util.dateParts(d));
    return query.fetch(this, last, i) * Math.exp(-query.fetch(this.args.parent, d, i) * dcf);
  };
  pyfy.bond = Bond;
  function Bond(start, dm, num, rate, notional, daycount) {
    if (!(this instanceof Bond)) return new Bond(start, dm, num, rate, notional, daycount);
    pyfy.derived.apply(this);
    this.notional = notional || 1;
    this.daycount = daycount;
    this.rate = rate;
    this.schedule = pyfy.interval(start, dm, num).div(num);
    this.generate();
  }
  Bond.prototype = new pyfy.derived();
  Bond.prototype.generate = function() {
    this.bal = pyfy.acct(this.notional || 1);
    this.p_scheduled = this.schedule.mul(this.notional);
    this.p = this.schedule.mul(this.notional);
    this.bal.setParent(this.p.neg());
    this.i = this.bal.prev().dcf().mul(this.rate);
    this.setParent(this.p.add(this.i));
  };
  Bond.prototype.setSchedule = function(d) {
    this.schedule = d;
    this.generate();
    return this;
  };
  function Ziggurat() {
    var jsr = 123456789;
    var wn = new Array(128);
    var fn = new Array(128);
    var kn = new Array(128);
    function RNOR() {
      var hz = SHR3();
      var iz = hz & 127;
      return Math.abs(hz) < kn[iz] ? hz * wn[iz] : nfix(hz, iz);
    }
    this.nextGaussian = function() {
      return RNOR();
    };
    function nfix(hz, iz) {
      var r = 3.442619855899;
      var r1 = 1 / r;
      var x;
      var y;
      while (true) {
        x = hz * wn[iz];
        if (iz === 0) {
          x = -Math.log(UNI()) * r1;
          y = -Math.log(UNI());
          while (y + y < x * x) {
            x = -Math.log(UNI()) * r1;
            y = -Math.log(UNI());
          }
          return hz > 0 ? r + x : -r - x;
        }
        if (fn[iz] + UNI() * (fn[iz - 1] - fn[iz]) < Math.exp(-.5 * x * x)) {
          return x;
        }
        hz = SHR3();
        iz = hz & 127;
        if (Math.abs(hz) < kn[iz]) {
          return hz * wn[iz];
        }
      }
    }
    function SHR3() {
      var jz = jsr;
      var jzr = jsr;
      jzr ^= jzr << 13;
      jzr ^= jzr >>> 17;
      jzr ^= jzr << 5;
      jsr = jzr;
      return jz + jzr | 0;
    }
    function UNI() {
      return .5 * (1 + SHR3() / -Math.pow(2, 31));
    }
    function zigset() {
      jsr ^= new Date().getTime();
      var m1 = 2147483648;
      var dn = 3.442619855899;
      var tn = dn;
      var vn = .00991256303526217;
      var q = vn / Math.exp(-.5 * dn * dn);
      kn[0] = Math.floor(dn / q * m1);
      kn[1] = 0;
      wn[0] = q / m1;
      wn[127] = dn / m1;
      fn[0] = 1;
      fn[127] = Math.exp(-.5 * dn * dn);
      for (var i = 126; i >= 1; i--) {
        dn = Math.sqrt(-2 * Math.log(vn / dn + Math.exp(-.5 * dn * dn)));
        kn[i + 1] = Math.floor(dn / tn * m1);
        tn = dn;
        fn[i] = Math.exp(-.5 * dn * dn);
        wn[i] = dn / m1;
      }
    }
    zigset();
  }
  var z = new Ziggurat();
  var rndNorm = pyfy.rndNorm = z.nextGaussian;
  function Random() {
    if (!(this instanceof Random)) return new Random();
    Base.call(this);
  }
  pyfy.random = Random;
  Random.prototype = new Base();
  Random.prototype.fn = function() {
    return Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
  };
  Random.prototype.correl = function(correl) {
    return pyfy.correl(this, correl);
  };
  Random.prototype.wiener = function() {
    return pyfy.wiener(this);
  };
  pyfy.wiener = Wiener;
  function Wiener(random) {
    if (!(this instanceof Wiener)) return new Wiener(random);
    Base.apply(this);
    this.change = this.diff(this);
    this.random = random || new Random();
    this.inputs = [ random ];
  }
  Wiener.prototype = new Base();
  Wiener.prototype.rawDates = function(query) {
    var res = {};
    if (query && query.cache[this.ID] && query.cache[this.ID].dates) {
      query.cache[this.ID].dates.forEach(function(d) {
        res[d] = d;
      });
    }
    return res;
  };
  Wiener.prototype.fn = function(query, d) {
    var cache = query.cache[this.ID], val;
    if (!cache.dates) {
      cache.dates = [ d ];
      cache.first = {
        x: d,
        y: 0
      };
      cache.last = {
        x: d,
        y: 0
      };
      return 0;
    }
    if (d > cache.last.x) {
      cache.dates.push(d);
      val = cache.last.y + query.fetch(this.random, d) * (d - cache.last.x) / pyfy.util.DAYMS / 365.25;
      cache.last = {
        x: d,
        y: val
      };
      return val;
    }
    if (d < cache.first.x) {
      cache.dates.slice(0, 0, d);
      val = cache.min.y - query.fetch(this.random, d) * (cache.first.x - d) / pyfy.util.DAYMS / 365.25;
      cache.first = {
        x: d,
        y: val
      };
      return val;
    }
    var datePos = pyfy.util.bisect(cache.dates, d), prev = {
      x: cache.dates[datePos - 1]
    }, next = {
      x: cache.dates[datePos]
    };
    prev.y = query.fetch(this, prev.x);
    next.y = query.fetch(this, next.x);
    cache.dates.splice(datePos, 0, d);
    return prev.y + (d - prev.x) / (next.x - prev.x) * (next.y - prev.y);
  };
  Wiener.prototype.dates = function(query) {
    return query ? query.cache[this.ID].dates.all : [];
  };
  pyfy.logNorm = function(s, vol, r) {
    return new Norm(s, vol, r);
  };
  function LogNorm(s, r, vol) {
    if (!(this instanceof LogNorm)) return new LogNorm(s, r, vol);
    Wiener.apply(this);
    this.s = s || 0;
    this.r = r || 0;
    this.vol = vol || 0;
  }
  LogNorm.prototype = new Wiener();
  LogNorm.prototype.inputs = function() {
    return [ this.s, this.r, this.vol ];
  };
  LogNorm.prototype.fn = function(query, d) {
    if (query.cache[this.ID].values.length == 0) {
      var d0 = new Date();
      query.cache[this.ID].values[d0] = s;
      query.fetch(this.parent, d0);
    }
    return vol * Math.sqrt(dt) * query.fetch(this.parent, d);
    var dt = (cache.dates[i] - (cache.dates[i - 1] || cache.dates[0])) / 365, s = i > 0 ? this.fetch(cache, d, i - 1) : this.s, r = fetch(this.r, cache, d, i), vol = fetch(this.vol, cache, d, i), e = (r - Math.pow(vol, 2) / 2) * dt + vol * Math.sqrt(dt) * rndNorm();
    return s * Math.exp(e);
  };
  function Correl(parent, correl, random) {
    if (!(this instanceof Correl)) return new Correl(parent, correl);
    Random.call(this);
    this.args.parent = parent;
    this.args.random = random || new Random();
    this.args.correl = correl;
  }
  pyfy.correl = Correl;
  Correl.prototype = new Random();
  Correl.prototype.fn = function(query, d, i) {
    var correl = query.fetch(this.args.correl, d, i);
    return correl * query.fetch(this.args.parent, d, i) + Math.sqrt(1 - correl * correl) * query.fetch(this.args.random, d, i);
  };
  pyfy.simul = Simul;
  function Simul(num) {
    if (!(this instanceof Simul)) return new Simul(num);
    Query.call(this);
    this.num = num;
  }
  Simul.prototype = new Query();
  Simul.prototype.fetch = function(obj, d, i) {
    if (!isNaN(obj)) return obj;
    var values = this.cache[obj.ID].values;
    values[d] = values[d] || [];
    if (values[d][i] === undefined) {
      var fn = obj.fn(this, d.valueOf(), i);
      if (fn !== undefined) values[d][i] = fn;
    }
    return values[d][i];
  };
  Simul.prototype.get = function(obj) {
    return [].concat(this.dates(obj)).map(function(d) {
      var res = [], i = this.num;
      while (i--) res.push(this.fetch(obj, d.valueOf(), i));
      return res;
    }, this);
  };
})();