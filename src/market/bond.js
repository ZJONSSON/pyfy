/*global pyfy*/
pyfy.bond = Bond;

function Bond(start,dm,num,rate,notional,daycount) {
  if (!(this instanceof Bond))
    return new Bond(start,dm,num,rate,notional,daycount);
  pyfy.derived.apply(this);
  this.notional = notional || 1;
  this.daycount = daycount;
  this.rate = rate;
  this.schedule = pyfy.interval(start,dm,num).div(num);
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
