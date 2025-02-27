.DEFAULT_GOAL := all

DOCKER_IMAGE = fastify-server

all:
	@make -j4 up

build:
	docker build -t $(DOCKER_IMAGE) .

up: build
	docker run -p 3000:3000 $(DOCKER_IMAGE)

.PHONY: build up all