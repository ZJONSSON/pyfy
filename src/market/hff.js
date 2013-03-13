
function dmonth(DisplayTo,DisplayFrom) {
  return DisplayTo.getMonth() - DisplayFrom.getMonth() + (12 * (DisplayTo.getFullYear() - DisplayFrom.getFullYear()));
}


days360 = function(d1,d2) {
  return Math.abs(d1-d2)/pyfy.util.DAYMS /365*360
}


hff = function(issue,maturity,interest,ocpi) {
  var periods = dmonth(maturity,issue) /6;
      annuity = (interest/2) / (1-(1/Math.pow((1+interest/2),periods))), 
  per = pyfy.interval(issue,6,periods)
  hff = per.mul(annuity)
  hff.bal = pyfy.stock({x:issue,y:1}).sub(0)
  hff.i = per.mul(hff.bal.last()).mul(interest/2)
  hff.p = hff.sub(hff.i)
  hff.bal.other = hff.p.cumul()
  return hff;
}

function dirty(curve,date,cache) {
 return this.pv(curve,date,cache) / this.bal.point(date,cache);
}



hff44 = hff(new Date(2004,5,15),new Date(2044,5,15),0.0375,235.7)
