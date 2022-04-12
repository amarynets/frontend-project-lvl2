install:
	npm ci

run:
	node bin/gendiff.js

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npx test --coverage --coverageProvider=v8