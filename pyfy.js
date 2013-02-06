/**
  * pyfy.js (c) 2008-2013 Sigurgeir Orn Jonsson (ziggy.jonsson.nyc@gmail.com)
  * @license http://creativecommons.org/licenses/by-nc-sa/3.0/
  * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
  */
var pyfy = {};

(function() {
  var DAYMS = 1e3 * 60 * 60 * 24;
  function today() {
    return new Date(Math.floor(new Date() / DAYMS) * DAYMS + 1e3 * 60 * 60 * 5);
  }
  function ascending(a, b) {
    return +a - b;
  }
  pyfy.Base = Base;
  var ID = 0;
  function Base() {
    this.ID = ID++;
  }
  Base.prototype.dates = function(d) {
    var self = this, dates = [], rawDates = this.rawDates();
    if (d) [].concat(d).forEach(function(d) {
      rawDates[d] = d;
    });
    for (var date in rawDates) {
      dates.push(rawDates[date]);
    }
    return dates.sort(ascending);
  };
  Base.prototype.rawDates = function(dates, ids) {
    return dates || {};
  };
  Base.prototype.point = function(d, cache) {
    var res = 0;
    this.value(d, cache).forEach(function(e, i) {
      if (e.x == d) res = e.y;
    });
    return res;
  };
  Base.prototype.value = function(dates, cache) {
    return this.get(dates, cache)[this.ID];
  };
  Base.prototype.y = function(dates, cache) {
    return this.value(dates, cache).map(function(d) {
      return d.y;
    });
  };
  Base.prototype.x = function(dates, cache) {
    return this.dates(dates);
  };
  Base.prototype.get = function(dates, cache) {
    if (!cache) cache = {};
    var allDates = cache.__dates__ = this.dates(dates).sort(ascending);
    cache.__dt__ = allDates.map(function(d, i) {
      return (d - (allDates[i - 1] || allDates[0])) / DAYMS;
    });
    if (!cache[this.ID]) cache[this.ID] = [];
    var l = cache.__dates__.length, i;
    for (i = 0; i < l; i++) {
      this.fetch(cache, cache.__dates__[i], i);
      if (cache[this.ID].length == l) {
        break;
      }
    }
    return cache;
  };
  Base.prototype.fetch = function(cache, d, i) {
    if (!cache[this.ID]) cache[this.ID] = [];
    if (cache[this.ID][i] === undefined) cache[this.ID][i] = {
      x: d,
      y: this.fn(cache, d, i)
    };
    return cache[this.ID][i];
  };
  [ Cumul, Diff, Last, Max, Min, Neg ].forEach(function(Fn) {
    Base.prototype[Fn.name.toLowerCase()] = function() {
      return new Fn(this);
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
  Base.prototype.filter = function(min, max) {
    return new Filter(this, min, max);
  };
  pyfy.const = pyfy.c = function(d) {
    return new Const(d);
  };
  function Const(d) {
    this.const = d;
  }
  Const.prototype = new Base();
  Const.prototype.fn = function() {
    return this.const;
  };
  function Data(d) {
    Base.apply(this, arguments);
    this.data = {};
    this.sorted = [];
    this._dates = [];
    if (d) this.update(d);
  }
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
    this._dates = [];
    this.sorted = Object.keys(this.data).map(function(key) {
      var d = self.data[key];
      self._dates.push(d.x);
      return d;
    }).sort(ascending);
    return this;
  };
  Data.prototype.set = function(a) {
    this.data = {};
    return this.update(a);
  };
  pyfy.flow = function(d) {
    return new Flow(d);
  };
  pyfy.Flow = Flow;
  function Flow(d) {
    Data.apply(this, arguments);
  }
  Flow.prototype = new Data();
  Flow.prototype.fn = function(cache, d, i) {
    var self = this;
    cache[this.ID] = cache.__dates__.map(function(d) {
      return self.data[d] || {
        x: d,
        y: 0
      };
    });
    return cache[this.ID][i];
  };
  pyfy.Stock = Stock;
  pyfy.stock = function(d) {
    return new Stock(d);
  };
  function Stock() {
    Data.apply(this, arguments);
  }
  Stock.prototype = new Data();
  Stock.prototype.fn = function(cache, d, i) {
    var self = this;
    cache[this.ID] = cache.__dates__.map(function(d) {
      var i = self.sorted.length;
      while (i--) {
        if (self.sorted[i].x <= d) return {
          x: d,
          y: self.sorted[i].y
        };
      }
      return {
        x: d,
        y: 0
      };
    });
    return cache[this.ID][i];
  };
  Stock.prototype.val = function(d) {
    var self = this;
    if (arguments.length === 0) return this.sorted;
    if (d.length === undefined) d = [ d ];
    return d.map(function(d) {
      var i = self.sorted.length;
      while (--i) {
        if (self.sorted[i].x <= d) return {
          x: d,
          y: self.sorted[i].y
        };
      }
      return self.sorted[0];
    });
  };
  pyfy.Price = Price;
  pyfy.price = function(d) {
    return new Price(d);
  };
  function Price() {
    Data.apply(this, arguments);
  }
  Price.prototype = new Data();
  Price.prototype.fn = function(cache, d, i) {
    var self = this;
    cache[this.ID] = cache.__dates__.map(function(d) {
      var i = self.sorted.length, last = self.sorted[self.sorted.length - 1];
      while (i--) {
        var next = self.sorted[i];
        if (next.x <= d) return {
          x: d,
          y: next.y + (last.y - next.y) * (d - next.x) / (next.x - last.x)
        };
        last = next;
      }
      return {
        x: d,
        y: 0
      };
    });
    return cache[this.ID][i];
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
    this.parent = d;
    if (fn) this.fn = fn;
  }
  Derived.prototype = new Base();
  Derived.prototype.rawDates = function() {
    return this.parent.rawDates.apply(this.parent, arguments);
  };
  Derived.prototype.fn = function() {
    return this.parent.fn.apply(this.parent, arguments);
  };
  pyfy.Filter = Filter;
  function Filter(d, min, max) {
    Derived.call(this, d);
    this.min = min || -Infinity;
    this.max = max || Infinity;
  }
  Filter.prototype = new Derived();
  Filter.prototype.fn = function(cache, d, i) {
    return d >= this.min && d <= this.max ? this.parent.fetch(cache, d, i - 1).y : 0;
  };
  pyfy.Last = Last;
  function Last(d) {
    Derived.call(this, d);
  }
  Last.prototype = new Derived();
  Last.prototype.fn = function(cache, d, i) {
    return 0 + (i > 0 && this.parent.fetch(cache, d, i - 1).y);
  };
  pyfy.Cumul = Cumul;
  function Cumul(d) {
    Derived.call(this, d);
  }
  Cumul.prototype = new Derived();
  Cumul.prototype.fn = function(cache, d, i) {
    return this.parent.fetch(cache, d, i).y + (i > 0 && cache[this.ID][i - 1].y);
  };
  pyfy.Diff = Diff;
  function Diff(d) {
    Derived.call(this, d);
  }
  Diff.prototype = new Derived();
  Diff.prototype.fn = function(cache, d, i) {
    var last = Math.max(i - 1, 0);
    return +this.parent.fetch(cache, d, i).y - (this.parent.fetch(cache, d, last).y || 0);
  };
  pyfy.sum = sum;
  pyfy.Sum = Sum;
  function sum() {
    return new Sum.apply(this, arguments);
  }
  function Sum() {
    this.parents = Array.prototype.slice(arguments);
  }
  Sum.prototype = new Base();
  Sum.prototype.dates = function() {
    var dates = {};
    this.parents.forEach(function(d) {
      d.dates().forEach(function(d) {
        dates[d] = d;
      });
    });
    return Object.keys(dates).map(function(key) {
      return dates[key];
    }).sort(ascending);
  };
  Sum.prototype.fn = function(cache, d, i) {
    var sum = 0;
    this.parents.forEach(function(d) {
      sum += d.fetch(cache, d, i).y;
    });
    return sum;
  };
  pyfy.Max = Max;
  function Max(d) {
    this.max = 0;
    Derived.call(this, d);
  }
  Max.prototype = new Derived();
  Max.prototype.fn = function(cache, d, i) {
    return Math.max(this.parent.fetch(cache, d, i).y, this.max);
  };
  pyfy.Min = Min;
  function Min(d) {
    this.min = 0;
    Derived.call(this, d);
  }
  Min.prototype = new Derived();
  Min.prototype.fn = function(cache, d, i) {
    return Math.min(this.parent.fetch(cache, d, i).y, this.min);
  };
  pyfy.Neg = Neg;
  function Neg(d) {
    Derived.call(this, d);
  }
  Neg.prototype = new Derived();
  Neg.prototype.fn = function(cache, d, i) {
    return -this.parent.fetch(cache, d, i).y;
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
    }
  };
  Object.keys(ops).forEach(function(op) {
    Base.prototype[op] = function(d) {
      return new Operator(op, this, d);
    };
  });
  function Operator(op, parent, other) {
    Base.apply(this, arguments);
    this.parent = parent;
    this.other = other;
    this.op = op;
  }
  Operator.prototype = new Base();
  Operator.prototype.rawDates = function(dates, ids) {
    dates = dates || {};
    ids = ids || {};
    if (!ids[this.ID]) {
      ids[this.ID] = true;
      if (this.parent.rawDates) this.parent.rawDates(dates, ids);
      if (this.other.rawDates) this.other.rawDates(dates, ids);
    }
    return dates;
  };
  Operator.prototype.fn = function(cache, d, i) {
    var a = this.parent.fetch(cache, d, i).y, b = this.other.fetch ? this.other.fetch(cache, d, i).y : this.other;
    return ops[this.op](a, b);
  };
  pyfy.ir = function(d) {
    return new Ir(d);
  };
  function Ir(d) {
    Stock.apply(this, arguments);
  }
  Ir.prototype = new Stock();
  Ir.prototype.df = function(val) {
    return new Df(this, val);
  };
  function Df(d, val) {
    Derived.call(this, d);
    this.val = val;
  }
  Df.prototype = new Derived();
  Df.prototype.rawDates = function(dates, ids) {
    ids = ids || {};
    dates = dates || {};
    if (!ids[this.ID]) {
      this.parent.rawDates.apply(this.parent, dates, ids);
      if (this.val) dates[this.val] = this.val;
      ids[this.ID] = true;
    }
    return dates;
  };
  Df.prototype.fn = function(cache, d, i) {
    var self = this, last = 1, lastDate = this.val || cache.__dates__[0];
    cache[this.ID] = cache.__dates__.map(function(d, i) {
      var res = {
        x: d,
        y: 0
      };
      if (d >= lastDate) {
        res.y = last = last * Math.exp(-self.parent.fetch(cache, d, i).y * (d - lastDate) / DAYMS / 365);
        lastDate = d;
      }
      return res;
    });
    return cache[this.ID][i];
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
  Norm.prototype.fn = function(cache, d, i) {
    var s = this.s, self = this, dates = cache.__dates__;
    cache[this.ID] = dates.map(function(d, i) {
      return d - (dates[i - 1] || dates[0]) / DAYMS;
    }).map(function(dt, i) {
      var e = self.r - Math.pow(self.vol, 2) / 2 * dt + self.vol * Math.sqrt(dt) * rndNorm();
      return {
        x: dates[i],
        y: s = s * Math.exp(e)
      };
    });
    return cache[this.ID][i];
  };
})();