/*global pyfy,Derived*/

pyfy.Acct = Acct;

pyfy.acct = function(d) {
  return new Acct(d);
};

function Acct(d) {
  Derived.call(this,d);
  this.start = d || 0;
}

Acct.prototype = new Derived();


Acct.prototype.fn = function(res,d) {
  var dates = this.parent.dates(res), fs
      pos = pyfy.util.bisect(dates,d);
      
  if (pos<1) return this.start;
  if (dates[pos] == d) return res.fetch(this,dates[pos-1]) + res.fetch(this.parent,d);
  return res.fetch(this,dates[pos-1]);
};