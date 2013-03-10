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
	src/core/base.js \
	src/core/const.js \
	src/core/sum.js \
	src/core/data.js \
	src/core/data/flow.js \
	src/core/data/stock.js \
	src/core/data/price.js \
	src/core/data/interval.js \
	src/core/derived.js \
	src/core/deriv/period.js \
	src/core/deriv/last.js \
	src/core/deriv/cumul.js \
	src/core/deriv/diff.js \
	src/core/deriv/max.js \
	src/core/deriv/min.js \
	src/core/deriv/neg.js \
	src/core/operator.js \
	src/market/ir.js \
	src/stat/ziggurat.js \
	src/stat/norm.js \
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