/*global pyfy,Derived*/

pyfy.acct = Acct;

function Acct(parent,start) {
  if (!(this instanceof Acct))
    return new Acct(parent,start);
  Base.call(this);
  this.args.parent = parent;
  this.args.start = d || 0;
}

Acct.prototype = new Base();

Acct.prototype.fn = function(query,d,i) {
  var dates = query.dates(this.args.parent),
      pos = pyfy.util.bisect(dates,d);

  if (pos<1) return this.start;
  if (dates[pos] == d) return query.fetch(this,dates[pos-1],i) + query.fetch(this.args.parent,d,i);
  return query.fetch(this,dates[pos-1],i);
};