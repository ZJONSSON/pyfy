var DAYMS = 1000*60*60*24;
function today() {
  return new Date(Math.floor(new Date()/DAYMS)*DAYMS+1000*60*60*5);
}