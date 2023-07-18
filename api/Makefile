.PHONY: run test

run:
	. ./env/bin/activate && flask run --debugger

test:
	./env/bin/python -m unittest discover -s . -p '*_test.py'

deps:
	./env/bin/pip freeze > requirements.txt
