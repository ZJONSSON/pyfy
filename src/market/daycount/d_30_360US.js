/*global pyfy*/
pyfy.daycount.d_30_360US = function(d1,d2) {
  if (d1.lastofFeb && d2.lastofFeb) d2.d = 30;
  if (d1.lastofFeb) d1.d = 30;
  if (d2.d == 31 && (d1.d == 30 || d1.d == 31)) d2.d = 30;
  if (d1.d == 31) d1.d = 30;
  return (360 * (d2.y - d1.y) + 30 * (d2.m - d1.m) + (d2.d - d1.d)) / 360;
};
