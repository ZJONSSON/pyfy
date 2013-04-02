/*global pyfy,Derived*/

pyfy.acct = function(parent,start) {
  return new Acct()
    .set("parent",parent)
    .set("start",start || 0);
};

function Acct() {
  Base.call(this);
}

Acct.prototype = new Base();

Acct.prototype.fn = function(query,d,i) {
  var dates = query.dates(this.args.parent),
      pos = pyfy.util.bisect(dates,d);

  if (pos<1) return this.args.start;
  if (dates[pos] == d) return query.fetch(this,dates[pos-1],i) + query.fetch(this.args.parent,d,i);
  return query.fetch(this,dates[pos-1],i);
};