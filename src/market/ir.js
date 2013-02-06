pyfy.ir = function(d) {
  return new Ir(d);
};

function Ir(d) {
  Stock.apply(this,arguments);
}

Ir.prototype = new Stock();

Ir.prototype.df = function(val) {
  return new Df(this,val);
};

function Df(d,val) {
  Derived.call(this,d);
  this.val = val;
}

Df.prototype = new Derived();

Df.prototype.rawDates = function(dates,ids) {
  ids = ids || {};
  dates = dates || {};
  if (!ids[this.ID]) {
   this.parent.rawDates.apply(this.parent,dates,ids);
   if (this.val) dates[this.val] = this.val;
   ids[this.ID] = true;
  }
  return dates;
};

Df.prototype.fn = function(cache,d,i) {
  var self = this,
      last = 1,
      lastDate = this.val || cache.__dates__[0];

  cache[this.ID] = cache.__dates__.map(function(d,i) {
    var res = {x:d,y:0};
    if (d>=lastDate) {
      res.y = last = last * Math.exp(-self.parent.fetch(cache,d,i).y*(d-lastDate)/DAYMS/365.0) ;
      lastDate = d;
    }
    return res;
  });
  return cache[this.ID][i];
};