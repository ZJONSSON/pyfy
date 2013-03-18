/*global pyfy*/
pyfy.interval = function(start,dm,no,val) {
  start = start || pyfy.util.today();
  var interval = []; 
  for (var i = 0;i<(no+1);i++) {
    interval.push({
      x: new Date(start.getFullYear(),start.getMonth()+i*dm,start.getDate()),
      y: (!i) ? 0 : val || 1
    });
  }
  return pyfy.flow(interval);
};
