/*global pyfy*/
pyfy.calendar.is = function(date) {
  var y = date.getFullYear(),
      m = date.getMonth(),
      d = date.getDate();

  return pyfy.calendar.weekday(date) && 

    // Páskar, Uppstigningardagur og Hvítasunna
    pyfy.calendar.easter(date,[+1,-2,-3,+39,50]) &&  

    // Sautjándi júní
    !(m==5 && d==17) &&   

    // Fyrsti janúar
    !(m===0 && d == 1) &&  

    // Jólin
    !(m==11 && (d == 26 || d == 25))  &&

     // Fyrsti maí
    !(m==4 && d == 1) &&

    // Verslunarmannahelgi
    !(m == 7 && (date - pyfy.util.nextWeekday(new Date(y,7,1),1) === 0)) &&

    // Sumardagurinn fyrsti
    !(m == 3 && (date - pyfy.util.nextWeekday(new Date(y,3,19),4) === 0));

};
