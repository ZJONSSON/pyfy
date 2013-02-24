/*global pyfy,Derived*/

pyfy.Diff = Diff;

function Diff(d) {
  Derived.call(this,d);
}

Diff.prototype = new Derived();

Diff.prototype.fn = function(cache,d,i) {
  var last = Math.max(i-1,0);
  return  +this.parent.fetch(cache,d,i).y-(this.parent.fetch(cache,d,last).y || 0);
};