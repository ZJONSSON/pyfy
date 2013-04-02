/*global pyfy,Derived*/
pyfy.timeDiff = function(parent,date,daycount) {
  return new TimeDiff()
    .set("parent",parent)
    .set("daycount",daycount || pyfy.daycount.d_30_360)
    .set("date", date || new Date());
};

function TimeDiff() {
  Base.call(this,parent);
}

TimeDiff.prototype = new Base();

TimeDiff.prototype.fn = function(query,d) {
  var date = this.args.date;
  // If supplied date is a string, it's either "Last" date of the parent or (anything else) "First" date of parent
  if (typeof date ==="string") {
    var parentDates = query.dates(this.args.parent);
    date = new Date( (date.slice(0,1).toUpperCase() === 'L') ? parentDates[parentDates.length-1] : parentDates[0]);
  }
  return Math.abs(this.args.daycount(pyfy.util.dateParts(date),pyfy.util.dateParts(new Date(d))));
};

