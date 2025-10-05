.PHONY: build test deploy publish-npm publish-java

build:
	npm run build
	cd frontend && npm run build
	cd java && mvn clean compile

test:
	npm test
	cd java && mvn test

deploy-local:
	docker-compose up -d --build

deploy-aws:
	./scripts/deploy.sh production

publish-npm:
	npm publish

publish-java:
	cd java && mvn clean deploy

publish-all: publish-npm publish-java

install:
	npm install
	cd frontend && npm install
	cd java && mvn install

clean:
	rm -rf node_modules dist
	cd frontend && rm -rf node_modules dist
	cd java && mvn clean

start:
	npm run start:dev

stop:
	docker-compose down

logs:
	docker-compose logs -f

status:
	docker-compose ps
	kubectl get pods -n production