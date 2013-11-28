PATH := ./node_modules/.bin:${PATH}

.PHONY : init clean-docs clean build test dist publish

init:
	npm install

docs:
	docco src/*.coffee

clean-docs:
	rm -rf docs/

#clean: clean-docs:
#  rm -rf lib/ test/*.js

build:
	coffee -o ./build/ -c ./src/
	mkdir -p ./build/views/
	cp ./src/views/* ./build/views/
	cp ./src/package.json ./build/package.json && \
  cd ./build/ && npm install

build-watch:
	coffee -w -o ./build/ -c ./src/

test:
	nodeunit test/refix.js

run:
	cd ./build/ && node server.js

dist: clean init docs build test

publish: dist
	npm publish
