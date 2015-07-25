.PHONY: bootstrap test test-watch

bootstrap:
	@npm install

test:
	@npm test

test-watch:
	@./node_modules/.bin/nodemon --ext "js,impl" --exec "npm test"
