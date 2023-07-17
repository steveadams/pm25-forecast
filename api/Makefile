.PHONY: env run test

all: env run

env:
	@source ./env/bin/activate

run:
	@python3 server.py

test:
	@python3 -m unittest discover -s . -p 'test_*.py'
