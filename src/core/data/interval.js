pyfy.interval = function(start,dm,no,val) {
  var interval = [];
  for (var i = 0;i<no;i++) {
    interval.push({
      x: start = new Date(start.getFullYear(),start.getMonth()+dm,start.getDate()),
      y: val || 1
    });
  }
  return pyfy.flow(interval);
};