.PHONY: start stop restart logs test migrate clean clean_db start-dev stop_db

# Use the docker-compose.yml inside nestjs-api/
DOCKER_COMPOSE = docker compose -f docker-compose.yml

# Build and start all services (API, Postgres, Redis)
all:
	$(DOCKER_COMPOSE) up -d --build --remove-orphans

stop:
	$(DOCKER_COMPOSE) down --remove-orphans

# Stop all running containers (including volumes)
stop_db:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans

# Restart all services
restart: stop_db start

clean_db:
	docker stop $$(docker ps -q) || true
	docker rm $$(docker ps -aq) || true
	docker rmi crop-alert-geolocation-backend || true
	docker rmi crop-alert-geolocation-frontend || true
	# docker volume rm postgres_data postgres_data_test || true
	docker network rm crop-alert-geolocation_CropAlertNetwork || true

# Show real-time logs for all services
logs:
	$(DOCKER_COMPOSE) logs -f

# Run Prisma migrations
migrate:
	corepack enable && corepack prepare yarn@4.9.1 --activate
	cd nestjs-api && yarn install --immutable
	cd nestjs-api && yarn prisma generate
	cd nestjs-api && yarn prisma migrate deploy
	cd nestjs-api && yarn dotenv -e .env.test -- prisma migrate deploy

# Run tests outside the NestJS container
test: start
	cd nestjs-api && ./test.sh

# make sure to use localhost instead of postgres_db in .env +++++++++++++++++++++
# and localhost instead of redis_cache in .env.test
start-dev: start migrate
	docker stop CropAlerAPI || true
	docker rm CropAlerAPI || true
	cd nestjs-api && yarn start:dev

clean:
	cd nestjs-api && ./script.sh
