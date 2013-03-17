/*global pyfy,Data*/
pyfy.stream = Stream;

function Stream(data,options) {
	if (!(this instanceof Stream))
		return new Stream(data,options);

 Data.apply(this,arguments);
}

Stream.prototype = new Data();


/* This is a placeholder for the Stream object */
