var DAYMS = 1000*60*60*24;

function today() {
  return new Date(Math.floor(new Date()/DAYMS)*DAYMS+1000*60*60*5);
}

function ascending(a,b) { return +a-b;}

function fetch(obj,cache,d,i) {
  return (obj.fetch) ? obj.fetch(cache,d,i) : obj;
}