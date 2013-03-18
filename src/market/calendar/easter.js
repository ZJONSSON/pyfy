/*global pyfy*/
pyfy.calendar.easter = function(date,dt) {
  dt = dt || [1,-2];
  var y,c,n,k,i,j,l,m,d;
  if (1 < date.getMonth() < 4) {
    y = date.getFullYear();
    c = ~~(y / 100);
    n = y - 19 * ~~( y / 19 );
    k = ~~(( c - 17 ) / 25);
    i = c - ~~(c / 4) - ~~(( c - k ) / 3) + 19 * n + 15;
    i = i - 30 * ~~( i / 30 );
    i = i - ( i / 28 ) * ( 1 - ~~( i / 28 ) * ~~( 29 / ( i + 1 ) ) * ~~( ( 21 - n ) / 11 ) );
    j = y + ~~(y / 4) + i + 2 - c + ~~(c / 4);
    j = j - 7 * ~~( j / 7 );
    l = i - j;
    m = 3 + ~~(( l + 40 ) / 44) -1;
    d = Math.round(l + 28 - 31 * ~~( m / 4 ));
    return dt.every(function(dt) {
      return date-(new Date(y,m,d+dt));
    });
  }
  return true;
};