/*global pyfy*/
pyfy.daycount.d_act_act = function(d1,d2) {
  var dct = 0,
      _d1 = d1.date,
      _d2 = new Date(Math.min(new Date(_d1.getFullYear()+1,0,1),d2.date));

  while (_d1 < d2.date) {
    var  testDate = (new Date(_d1.getFullYear(),1,29)),
          denom = (testDate.getDate() == 29) ? 366 : 365;
    dct += Math.round((_d2 -_d1) / DAYMS) / denom;
    _d1 = _d2;
    _d2 = new Date(Math.min(new Date(_d1.getFullYear()+1,0,1),d2.date));
  }
  return dct;
};
