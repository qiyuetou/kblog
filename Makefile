test:
	@NODE_ENV=test mocha \
		--harmony \
		--reporter spec \
		--require should \
		*/test.js

.PHONY: test
