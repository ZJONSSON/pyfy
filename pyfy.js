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
    var res = {
      y: d.getFullYear(),
      m: d.getMonth(),
      d: d.getDate()
    };
    res.date = new Date(res.y, res.m, res.d);
    res.lastofMonth = new Date(res.y, res.m, res.d + 1).getMonth() == res.m + 1;
    res.lastFeb = res.m == 2 && res.lastofMonth;
    return res;
  };
  pyfy.util.today = function() {
    return pyfy.util.dateParts(new Date()).date;
  };
  pyfy.util.nextDay = function(d, i) {
    if (i === undefined) i = 0;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
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
  pyfy.res = function(id, res) {
    res = res || new Res();
    res.cache[id] = res.cache[id] || {
      values: {}
    };
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
    }, this);
  };
  Res.prototype.x = function() {
    if (typeof id === "object") id = id.ID;
    return this.dates.map(function(d) {
      return new Date(d);
    });
  };
  Res.prototype.val = function(id) {
    if (typeof id === "object") id = id.ID;
    return this.y(id).map(function(d, i) {
      return {
        x: new Date(this.dates[i]),
        y: d
      };
    }, this);
  };
  Res.prototype.get = function(obj, d) {
    if (!d) d = obj.dates();
    return [].concat(d).map(function(d) {
      return this.fetch(obj, d);
    }, this);
  };
  Res.prototype.fetch = function(obj, d) {
    if (!isNaN(obj)) return obj;
    if (!this.cache[obj.ID]) this.cache[obj.ID] = {
      values: {}
    };
    var values = this.cache[obj.ID].values;
    if (values[d] === undefined) {
      var fn = obj.fn(this, d);
      if (fn !== undefined) values[d] = fn;
    }
    return values[d];
  };
  var ID = 0;
  function Base() {
    this.ID = ID++;
  }
  pyfy.base = function() {
    return new Base();
  };
  pyfy.Base = Base;
  Base.prototype.dates = function(res) {
    res = res || new Res(this.ID);
    var cache = res.cache[this.ID] = res.cache[this.ID] || {
      values: {}
    };
    if (!cache.dates) {
      var rawDates = this.rawDates(res);
      cache.dates = [];
      cache.datePos = {};
      for (var date in rawDates) {
        cache.dates.push(+rawDates[date]);
      }
      cache.dates.sort(ascending).forEach(function(d, i) {
        cache.datePos[d] = i;
      });
    }
    return cache.dates;
  };
  Base.prototype.rawDates = function(res) {
    res = pyfy.res(this.ID, res);
    var cache = res.cache[this.ID];
    if (!cache.rawDates) {
      cache.rawDates = {};
      var inputs = typeof this.inputs === "function" ? this.inputs() : this.inputs;
      [].concat(inputs).filter(function(d) {
        return d && d.rawDates;
      }).forEach(function(input) {
        for (var d in input.rawDates(res)) {
          cache.rawDates[d] = +d;
        }
      });
    }
    return cache.rawDates;
  };
  Base.prototype.exec = function(d) {
    var res = pyfy.res(this.ID);
    res.dates = this.dates(res);
    if (d) {
      d = [].concat(d).map(function(d) {
        return d.valueOf();
      });
      res.dates = res.dates.concat(d).sort(ascending);
    }
    res.dates.forEach(function(d) {
      res.fetch(this, d);
    }, this);
    return res;
  };
  Base.prototype.fn = function() {
    return 0;
  };
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
    return this.exec(dates).y(this.ID);
  };
  Base.prototype.x = function(dates) {
    return this.exec(dates).x(this.ID);
  };
  Base.prototype.val = function(dates) {
    return this.exec(dates).val(this.ID);
  };
  function Const(d) {
    this.const = d || 0;
  }
  pyfy.const = pyfy.c = function(d) {
    Base.apply(this, arguments);
    return new Const(d);
  };
  Const.prototype = new Base();
  Const.prototype.fn = function() {
    return this.const;
  };
  Const.prototype.update = Const.prototype.set = function(d) {
    this.const = d;
    return this;
  };
  pyfy.sum = function(d) {
    return new Sum(d);
  };
  function Sum(d) {
    this.parents = d;
  }
  Sum.prototype = new Base();
  Sum.prototype.inputs = function() {
    return this.parents;
  };
  Sum.prototype.fn = function(res, d) {
    var sum = 0;
    this.parents.forEach(function(parent) {
      sum += res.fetch(parent, d);
    });
    return sum;
  };
  function Data(d) {
    Base.apply(this, arguments);
    this.data = {};
    this._dates = [];
    if (d) this.update(d);
  }
  pyfy.Data = Data;
  Data.prototype = new Base();
  Data.prototype.rawDates = function(res) {
    res = pyfy.res(this.ID, res);
    var cache = res.cache[this.ID];
    if (!cache.rawDates) {
      cache.rawDates = {};
      this._dates.forEach(function(e) {
        cache.rawDates[e] = e;
      });
    }
    return cache.rawDates;
  };
  Data.prototype.update = function(a) {
    if (arguments.length === 0) return this;
    if (!isNaN(a)) {
      var x = pyfy.util.today().valueOf();
      this.data[x] = a;
    } else {
      [].concat(a).forEach(function(d) {
        this.data[d.x.valueOf()] = d.y;
      }, this);
    }
    this._dates = Object.keys(this.data).map(function(key) {
      return +key;
    }).sort(ascending);
    return this;
  };
  Data.prototype.set = function(a) {
    this.data = {};
    return this.update(a);
  };
  Data.prototype.fn = function(res, d) {
    if (!Object.keys(this.data).length) return 0;
    if (this.data[d]) return this.data[d];
    var dates = this.dates(), next = pyfy.util.bisect(dates, d), prev = next - 1;
    if (next == dates.length) next -= 1;
    if (next === 0) prev = 0;
    return this._fn(d, dates[prev] || dates[next], dates[next]);
  };
  Data.prototype._fn = function(d, prev, next) {
    return undefined;
  };
  pyfy.flow = function(d) {
    return new Flow(d);
  };
  pyfy.Flow = Flow;
  function Flow() {
    Data.apply(this, arguments);
  }
  Flow.prototype = new Data();
  Flow.prototype.fn = function(res, d) {
    return this.data[d] || 0;
  };
  function Stock() {
    Data.apply(this, arguments);
  }
  pyfy.Stock = Stock;
  pyfy.stock = function(d) {
    return new Stock(d);
  };
  Stock.prototype = new Data();
  Stock.prototype._fn = function(d, last) {
    return this.data[last];
  };
  pyfy.Price = Price;
  pyfy.price = function(d) {
    return new Price(d);
  };
  function Price() {
    Data.apply(this, arguments);
  }
  Price.prototype = new Data();
  Price.prototype._fn = function(d, prev, next) {
    var prevVal = this.data[prev], nextVal = this.data[next];
    if (prev == next) return nextVal;
    return prev < d < next ? prevVal + (nextVal - prevVal) * (d - prev) / (next - prev) : nextVal;
  };
  pyfy.interval = function(start, dm, no, val) {
    var interval = [];
    for (var i = 0; i < no + 1; i++) {
      interval.push({
        x: new Date(start.getFullYear(), start.getMonth() + i * dm, start.getDate()),
        y: val || !i ? 0 : 1
      });
    }
    return pyfy.flow(interval);
  };
  pyfy.Derived = Derived;
  function Derived(d, fn) {
    Base.call(this, arguments);
    this.parent = d || new Base();
    if (fn) this.fn = fn;
  }
  Derived.prototype = new Base();
  Derived.prototype.inputs = function() {
    return this.parent;
  };
  Derived.prototype.rawDates = function(res) {
    return this.parent.rawDates(res);
  };
  Derived.prototype.fn = function(res, d) {
    return res.fetch(this.parent, d);
  };
  Derived.prototype.setParent = function(d) {
    this.parent = d;
    return this;
  };
  pyfy.Period = Period;
  function Period(d, start, fin) {
    Derived.call(this, d);
    this.start = start || -Infinity;
    this.fin = fin || Infinity;
  }
  Period.prototype = new Derived();
  Period.prototype.fn = function(res, d) {
    return d >= this.start && d <= this.fin ? res.fetch(this.parent, d) : 0;
  };
  pyfy.Prev = Prev;
  function Prev(d, start) {
    Derived.call(this, d);
    this.default = start || 0;
  }
  Prev.prototype = new Derived();
  Prev.prototype.fn = function(res, d) {
    var dates = this.dates(res), datePos = res.cache[this.ID].datePos[d];
    return datePos > 0 ? res.fetch(this.parent, dates[datePos - 1]) : this.default;
  };
  pyfy.Cumul = Cumul;
  function Cumul(d) {
    Derived.call(this, d);
  }
  Cumul.prototype = new Derived();
  Cumul.prototype.fn = function(res, d) {
    var dates = this.dates(res), datePos = res.cache[this.ID].datePos[d];
    return res.fetch(this.parent, d) + (datePos ? res.fetch(this, dates[datePos - 1]) : 0);
  };
  pyfy.Diff = Diff;
  function Diff(d) {
    Derived.call(this, d);
  }
  Diff.prototype = new Derived();
  Diff.prototype.fn = function(res, d) {
    var dates = this.dates(res), datePos = res.cache[this.ID].datePos[d];
    return datePos ? res.fetch(this.parent, d) - res.fetch(this.parent, dates[datePos - 1]) : 0;
  };
  pyfy.Max = Max;
  function Max(d, max) {
    Derived.call(this, d);
    this.max = max || 0;
  }
  Max.prototype = new Derived();
  Max.prototype.fn = function(res, d) {
    return Math.max(res.fetch(this.parent, d), this.max);
  };
  pyfy.Min = Min;
  function Min(d, min) {
    Derived.call(this, d);
    this.min = min || 0;
  }
  Min.prototype = new Derived();
  Min.prototype.fn = function(res, d) {
    return Math.min(res.fetch(this.parent, d), this.min);
  };
  pyfy.Neg = Neg;
  function Neg(d) {
    Derived.call(this, d);
  }
  Neg.prototype = new Derived();
  Neg.prototype.fn = function(res, d) {
    return -res.fetch(this.parent, d);
  };
  pyfy.Acct = Acct;
  pyfy.acct = function(d) {
    return new Acct(d);
  };
  function Acct(d) {
    Derived.call(this, d);
    this.start = d || 0;
  }
  Acct.prototype = new Derived();
  Acct.prototype.fn = function(res, d) {
    var dates = this.parent.dates(res), fs;
    pos = pyfy.util.bisect(dates, d);
    if (pos < 1) return this.start;
    if (dates[pos] == d) return res.fetch(this, dates[pos - 1]) + res.fetch(this.parent, d);
    return res.fetch(this, dates[pos - 1]);
  };
  pyfy.Calendar = Calendar;
  function Calendar(d, calendar) {
    Derived.call(this, d);
    if (calendar) this.calendar = calendar;
  }
  Calendar.prototype = new Derived();
  Calendar.prototype.rawDates = function(res) {
    res = pyfy.res(this.ID, res);
    var cache = res.cache[this.ID];
    cache.dateMap = {};
    cache.rawDates = {};
    for (var pd in this.parent.rawDates(res)) {
      var d = this.calendar(new Date(+pd)).valueOf();
      cache.rawDates[d] = +d;
      cache.dateMap[d] = +pd;
    }
    return cache.rawDates;
  };
  Calendar.prototype.fn = function(res, d) {
    var cache = res.cache[this.ID];
    return res.fetch(this.parent, cache.dateMap[d] || this.calendar(d));
  };
  Calendar.prototype.calendar = function(d) {
    var weekday = d.getDay();
    return weekday === 0 || weekday === 6 ? this.calendar(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) : d;
  };
  pyfy.Operator = Operator;
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
    Base.apply(this, arguments);
    this.left = left;
    this.right = right;
    this.op = op;
  }
  pyfy.Operator = Operator;
  Operator.prototype = new Base();
  Operator.prototype.inputs = function() {
    return [ this.left, this.right ];
  };
  Operator.prototype.fn = function(res, d, i) {
    var left, right;
    right = res.fetch(this.right, d);
    if (!right && this.op == "mul") return 0;
    left = res.fetch(this.left, d);
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
  pyfy.Dcf = Dcf;
  function Dcf(parent, daycount) {
    Derived.call(this, parent);
    if (daycount !== undefined) this.setDaycount(daycount);
  }
  Dcf.prototype = new Derived();
  Dcf.prototype.fn = function(res) {
    var cache = res.cache[this.ID];
    if (Object.keys(cache.values).length) return 0;
    var dates = this.dates();
    cache.values = {};
    dates.slice(1).forEach(function(d, i) {
      var d1 = pyfy.util.dateParts(dates[i]), d2 = pyfy.util.dateParts(d);
      cache.values[d] = this.daycount(d1, d2);
    }, this);
  };
  Dcf.prototype.daycount = pyfy.daycount.d_30_360;
  Dcf.prototype.setDaycount = function(d) {
    this.daycount = typeof d === "string" ? pyfy.daycount[d] : d;
    return this;
  };
  pyfy.ir = function(d) {
    return new Ir(d);
  };
  function Ir() {
    Stock.apply(this, arguments);
    this.df = new Df(this);
    this.daycount = pyfy.daycount.d_30_360;
  }
  Ir.prototype = new Stock();
  Ir.prototype.setDaycount = function(d) {
    this.daycount = typeof d === "string" ? pyfy.daycount[d] : d;
    return this;
  };
  Ir.prototype._fn = function(d, last, next) {
    return this.data[next];
  };
  pyfy.df = function(d) {
    return new Derived(d);
  };
  function Df(d, val) {
    Derived.call(this, d);
    this.val = val;
  }
  Df.prototype = new Dcf();
  Df.prototype.rawDates = function(res) {
    Base.prototype.rawDates.call(this, res);
    return {};
  };
  Df.prototype.fn = function(res, d) {
    var dates = this.dates(res);
    var pos = pyfy.util.bisect(dates, d);
    var last = dates[pos - 1];
    if (!last) return d == dates[pos] ? 1 : 0;
    var dcf = this.parent.daycount(pyfy.util.dateParts(last), pyfy.util.dateParts(d));
    return res.fetch(this, last) * Math.exp(-res.fetch(this.parent, d) * dcf);
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
  pyfy.norm = function(s, vol, r) {
    return new Norm(s, vol, r);
  };
  function rndNorm() {
    return Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
  }
  function Norm(s, r, vol) {
    Base.apply(this);
    this.s = s || 0;
    this.r = r || 0;
    this.vol = vol || 0;
  }
  Norm.prototype = new Base();
  Norm.prototype.inputs = function() {
    return [ this.s, this.r, this.vol ];
  };
  Norm.prototype.fn = function(cache, d, i) {
    var s = this.s, self = this, dates = cache.__dates__;
    var dt = (cache.dates[i] - (cache.dates[i - 1] || cache.dates[0])) / 365, s = i > 0 ? this.fetch(cache, d, i - 1) : this.s, r = fetch(this.r, cache, d, i), vol = fetch(this.vol, cache, d, i), e = (r - Math.pow(vol, 2) / 2) * dt + vol * Math.sqrt(dt) * rndNorm();
    return s * Math.exp(e);
  };
})();