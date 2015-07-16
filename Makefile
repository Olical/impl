.PHONY: bootstrap test

bootstrap:
	@npm install

test:
	@./node_modules/.bin/standard
	@./node_modules/.bin/_mocha
