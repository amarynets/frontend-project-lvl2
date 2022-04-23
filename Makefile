install:
	npm ci

run:
	node bin/gendiff.js

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8

clean:
	npx jest --clearCache