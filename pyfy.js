/**
  * pyfy.js (c) 2008-2013 Sigurgeir Orn Jonsson (ziggy.jonsson.nyc@gmail.com)
  * @license http://creativecommons.org/licenses/by-nc-sa/3.0/
  * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
  */
(function() {
  var pyfy = this.pyfy = {};
  if (typeof module !== "undefined") module.exports = pyfy;
  var DAYMS = 1e3 * 60 * 60 * 24;
  pyfy.util = {};
  pyfy.util.dateParts = function(d) {
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
    return pyty.util.dateParts(new Date());
  };
  pyfy.util.nextDay = function(d, i) {
    if (i === undefined) i = 0;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
  };
  function ascending(a, b) {
    return +a - b;
  }
  function fetch(obj, cache, d, i) {
    return obj.fetch ? obj.fetch(cache, d, i) : obj;
  }
  var ID = 0;
  function Base() {
    this.ID = ID++;
  }
  pyfy.base = function() {
    return new Base();
  };
  pyfy.Base = Base;
  Base.prototype.dates = function(d) {
    var dates = [], rawDates = this.rawDates();
    if (d) [].concat(d).forEach(function(d) {
      rawDates[d] = d;
    });
    for (var date in rawDates) {
      dates.push(rawDates[date]);
    }
    return dates.sort(ascending);
  };
  Base.prototype.rawDates = function(dates, ids) {
    dates = dates || {};
    ids = ids || {};
    if (!ids[this.ID] && this.inputs) {
      var inputs = typeof this.inputs === "function" ? this.inputs() : this.inputs;
      ids[this.ID] = true;
      [].concat(this.inputs()).forEach(function(input) {
        if (input.rawDates) input.rawDates(dates, ids);
      });
    }
    return dates;
  };
  Base.prototype.y = function(dates) {
    return this.exec(dates)[this.ID];
  };
  Base.prototype.x = function(dates, cache) {
    return this.dates(dates);
  };
  Base.prototype.val = function(dates) {
    var cache = this.exec(dates);
    return cache[this.ID].map(function(d, i) {
      return {
        x: cache.__dates__[i],
        y: d
      };
    });
  };
  Base.prototype.exec = function(d) {
    var cache = {
      result: {}
    }, dates = cache.__dates__ = this.dates(d), l = dates.length;
    if (!cache.__dt__) cache.__dt__ = dates.map(function(d, i) {
      return (d - (dates[i - 1] || dates[0])) / DAYMS;
    });
    if (!cache[this.ID]) cache[this.ID] = [];
    dates.every(function(d, i) {
      this.fetch(cache, d, i);
      return cache[this.ID].length != l;
    }, this);
    return cache;
  };
  Base.prototype.fetch = function(cache, d, i) {
    if (!cache[this.ID]) cache[this.ID] = [];
    if (cache[this.ID][i] === undefined) {
      var res = this.fn(cache, d, i);
      if (res !== undefined) cache[this.ID][i] = res;
    }
    return cache[this.ID][i];
  };
  [ Cumul, Diff, Last, Max, Min, Neg ].forEach(function(Fn) {
    Base.prototype[Fn.name.toLowerCase()] = function(d) {
      return new Fn(this, d);
    };
  });
  Base.prototype.pv = function(curve, date, cache) {
    var pv = 0;
    this.mul(curve.df(date)).y(null, cache).forEach(function(cf) {
      pv += cf;
    });
    return pv;
  };
  Base.prototype.derived = function(fn) {
    return new Derived(this, fn);
  };
  Base.prototype.period = function(min, max) {
    return new Period(this, min, max);
  };
  Base.prototype.fn = function() {
    return 0;
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
  Sum.prototype.fn = function(cache, d, i) {
    var sum = 0;
    this.parents.forEach(function(d) {
      sum += d.fetch(cache, d, i);
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
  Data.prototype.rawDates = function(dates, ids) {
    dates = dates || {};
    ids = ids || {};
    if (!ids[this.ID]) {
      this._dates.forEach(function(e) {
        dates[e] = e;
      });
      ids[this.ID] = true;
    }
    return dates;
  };
  Data.prototype.update = function(a) {
    if (arguments.length === 0) return this;
    var self = this;
    if (!isNaN(a)) {
      var x = today();
      this.data[x] = {
        x: x,
        y: a
      };
    } else {
      if (a.length === undefined) a = [ a ];
      a.forEach(function(d) {
        self.data[d.x] = d;
      });
    }
    this._dates = Object.keys(this.data).map(function(key) {
      return this.data[key].x;
    }, this).sort(ascending);
    return this;
  };
  Data.prototype.set = function(a) {
    this.data = {};
    return this.update(a);
  };
  Data.prototype.fn = function(cache, d, i) {
    var self = this, dates = this.dates(), prev = this.data[dates[0]], last = this.data[dates[dates.length - 1]];
    cache[this.ID] = cache.__dates__.map(function(d) {
      if (!Object.keys(self.data).length) return 0;
      while (dates.length) {
        var next = self.data[dates[0]];
        if (d == next.x) return next.y;
        if (d < next.x) return self._fn(d, prev, next);
        prev = next;
        dates = dates.slice(1);
      }
      return last.y;
    });
    return cache[this.ID][i];
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
  Flow.prototype.fn = function(cache, d, i) {
    var self = this;
    cache[this.ID] = cache.__dates__.map(function(d) {
      return self.data[d] ? self.data[d].y : 0;
    });
    return cache[this.ID][i];
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
    return last.y;
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
    if (next.x == prev.x) return prev.y;
    if (d < next.x) return prev.y + (next.y - prev.y) * (d - prev.x) / (next.x - prev.x);
  };
  pyfy.interval = function(start, dm, no, val) {
    var interval = [];
    for (var i = 0; i < no; i++) {
      interval.push({
        x: start = new Date(start.getFullYear(), start.getMonth() + dm, start.getDate()),
        y: val || 1
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
  Derived.prototype.fn = function(cache, d, i) {
    return this.parent.fetch(cache, d, i);
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
  Period.prototype.fn = function(cache, d, i) {
    return d >= this.start && d <= this.fin ? this.parent.fetch(cache, d, i) : 0;
  };
  pyfy.Last = Last;
  function Last(d) {
    Derived.call(this, d);
  }
  Last.prototype = new Derived();
  Last.prototype.fn = function(cache, d, i) {
    return 0 + (i > 0 && this.parent.fetch(cache, d, i - 1));
  };
  pyfy.Cumul = Cumul;
  function Cumul(d) {
    Derived.call(this, d);
  }
  Cumul.prototype = new Derived();
  Cumul.prototype.fn = function(cache, d, i) {
    return this.parent.fetch(cache, d, i) + (i > 0 && cache[this.ID][i - 1]);
  };
  pyfy.Diff = Diff;
  function Diff(d) {
    Derived.call(this, d);
  }
  Diff.prototype = new Derived();
  Diff.prototype.fn = function(cache, d, i) {
    var last = Math.max(i - 1, 0);
    return +this.parent.fetch(cache, d, i) - (this.parent.fetch(cache, d, last) || 0);
  };
  pyfy.Max = Max;
  function Max(d, max) {
    Derived.call(this, d);
    this.max = max || 0;
  }
  Max.prototype = new Derived();
  Max.prototype.fn = function(cache, d, i) {
    return Math.max(this.parent.fetch(cache, d, i), this.max);
  };
  pyfy.Min = Min;
  function Min(d, min) {
    Derived.call(this, d);
    this.min = min || 0;
  }
  Min.prototype = new Derived();
  Min.prototype.fn = function(cache, d, i) {
    return Math.min(this.parent.fetch(cache, d, i), this.min);
  };
  pyfy.Neg = Neg;
  function Neg(d) {
    Derived.call(this, d);
  }
  Neg.prototype = new Derived();
  Neg.prototype.fn = function(cache, d, i) {
    return -this.parent.fetch(cache, d, i);
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
  Operator.prototype.fn = function(cache, d, i) {
    var left, right;
    right = fetch(this.right, cache, d, i);
    if (!right && this.op == "mul") return 0;
    left = fetch(this.left, cache, d, i);
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
    return Math.round((d2.date - d1.date) / DAYMS) / 360;
  };
  pyfy.daycount.d_act_act = function(d1, d2) {
    var dct = 0, _d1 = d1.date, _d2 = new Date(Math.min(new Date(_d1.getFullYear() + 1, 0, 1), d2.date));
    while (_d1 < d2.date) {
      var testDate = new Date(_d1.getFullYear(), 1, 29), denom = testDate.getDate() == 29 ? 366 : 365;
      dct += Math.round((_d2 - _d1) / DAYMS) / denom;
      _d1 = _d2;
      _d2 = new Date(Math.min(new Date(_d1.getFullYear() + 1, 0, 1), d2.date));
    }
    return dct;
  };
  pyfy.Dcf = Dcf;
  pyfy.dcf = function(a, b, c) {
    return new Dcf(a, b, c);
  };
  function Dcf(dates, daycount, calendar) {
    Base.apply(this, arguments);
    if (dates) dates = [].concat(dates).sort(ascending);
    this.customDates = dates;
    if (arguments.length > 1) this.daycount = daycount;
  }
  Dcf.prototype = new Base();
  Dcf.prototype.rawDates = function(dates) {
    dates = dates || {};
    if (this.customDates) {
      [].concat(this.customDates).forEach(function(d) {
        d = this.calendar(d);
        dates[d] = d;
      }, this);
    }
    return dates;
  };
  Dcf.prototype.fn = function(cache) {
    var res = {}, dates = this.dates();
    if (!dates.length) dates = cache.__dates__;
    dates.slice(1).map(function(d, i) {
      var d1 = pyfy.util.dateParts(dates[i]), d2 = pyfy.util.dateParts(d);
      res[d] = this.daycount(d1, d2);
    }, this);
    cache[this.ID] = cache.__dates__.map(function(d) {
      return res[d] || 0;
    });
  };
  Dcf.prototype.calendar = function(d) {
    return d;
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
  }
  Ir.prototype = new Stock();
  Ir.prototype.daycount = pyfy.dcf();
  pyfy.df = function(d) {
    return new Df(d);
  };
  function Df(d, val) {
    Derived.call(this, d);
    this.val = val;
  }
  Df.prototype = new Derived();
  Df.prototype.fn = function(cache, d, i) {
    var self = this, dt = cache.__dt__[i] / 365;
    return i === 0 ? 1 : fetch(this, cache, d, i - 1) * Math.exp(-fetch(self.parent, cache, d, i) * dt);
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
    var dt = cache.__dt__[i] / 365, s = i > 0 ? this.fetch(cache, d, i - 1) : this.s, r = fetch(this.r, cache, d, i), vol = fetch(this.vol, cache, d, i), e = (r - Math.pow(vol, 2) / 2) * dt + vol * Math.sqrt(dt) * rndNorm();
    return s * Math.exp(e);
  };
})();