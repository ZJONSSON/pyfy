/*global pyfy,Derived*/

pyfy.Last = Last;

function Last(d) {
  Derived.call(this,d);
}

Last.prototype = new Derived();

Last.prototype.fn = function(cache,d,i) {
  return 0 + (i>0 && (this.parent.fetch(cache,d,i-1)));
};