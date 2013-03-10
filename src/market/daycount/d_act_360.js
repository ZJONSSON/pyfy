/*global pyfy,pyfy.util.DAYMS*/
pyfy.daycount.d_act_360 = function(d1,d2) {
  return Math.round((d2.date - d1.date) / pyfy.util.DAYMS) / 360 ;
};