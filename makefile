# Libraries

NODEPATH ?= "./node_modules"
JS_UGLIFY = $(NODEPATH)/uglify-js2/bin/uglifyjs2
JS_TESTER = $(NODEPATH)/vows/bin/vows

all: \
	pyfy.js \
	pyfy.min.js
	

.INTERMEDIATE pyfy.js: \
	src/start.js \
	src/util.js \
	src/market/calendar.js \
	src/market/calendar/weekday.js \
	src/market/calendar/easter.js \
	src/market/calendar/target.js \
	src/market/calendar/is.js \
	src/core/query.js \
	src/core/base.js \
	src/core/const.js \
	src/core/sum.js \
	src/core/data.js \
	src/core/data/flow.js \
	src/core/data/stock.js \
	src/core/data/price.js \
	src/core/data/stream.js \
	src/core/data/interval.js \
	src/core/derived.js \
	src/core/deriv/period.js \
	src/core/deriv/prev.js \
	src/core/deriv/cumul.js \
	src/core/deriv/diff.js \
	src/core/deriv/max.js \
	src/core/deriv/min.js \
	src/core/deriv/neg.js \
	src/core/deriv/acct.js \
	src/core/deriv/call.js \
	src/core/deriv/put.js \
	src/core/deriv/calendar.js \
	src/core/operator.js \
	src/market/daycount/daycount.js \
	src/market/daycount/d_30_360.js \
	src/market/daycount/d_30E_360.js \
	src/market/daycount/d_30_360US.js \
	src/market/daycount/d_act_360.js \
	src/market/daycount/d_act_act.js \
	src/market/dcf.js \
	src/market/timediff.js \
	src/market/ir.js \
	src/market/bond.js \
	src/stat/ziggurat.js \
	src/stat/random.js \
	src/stat/wiener.js \
	src/stat/lognorm.js \
	src/stat/correl.js \
	src/stat/simul.js \
	src/end.js

pyfy.js: Makefile
	@rm -f $@
	@cat $(filter %.js,$^) > $@.tmp
	$(JS_UGLIFY) $@.tmp --comments -b indent-level=2 -o $@
	@rm $@.tmp

pyfy.min.js: pyfy.js Makefile
	@rm -f $@
	$(JS_UGLIFY) $< -c --comments -m -o $@

test: all
	@$(JS_TESTER)