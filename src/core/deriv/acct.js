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


Acct.prototype.fn = function(query,d) {
  var dates = this.parent.dates(query), fs
      pos = pyfy.util.bisect(dates,d);
      
  if (pos<1) return this.start;
  if (dates[pos] == d) return query.fetch(this,dates[pos-1]) + query.fetch(this.parent,d);
  return query.fetch(this,dates[pos-1]);
};