# Makefile for School Management System Backend

# Variables
COMPOSE_FILE = docker-compose.yml
PROJECT_NAME = sms-backend

# Default target
.DEFAULT_GOAL := help

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

## Development Commands

.PHONY: dev
dev: ## Start backend service in development mode
	@echo "$(GREEN)Starting backend service...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up --build

.PHONY: dev-detached
dev-detached: ## Start backend service in development mode (detached)
	@echo "$(GREEN)Starting backend service in detached mode...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up --build -d

.PHONY: stop
stop: ## Stop all running services
	@echo "$(YELLOW)Stopping all services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) stop

.PHONY: down
down: ## Stop and remove all containers, networks
	@echo "$(RED)Stopping and removing containers...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down

.PHONY: down-volumes
down-volumes: ## Stop and remove all containers, networks, and volumes
	@echo "$(RED)Stopping and removing containers, networks, and volumes...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down -v

.PHONY: restart
restart: down dev ## Restart all services

## Build Commands

.PHONY: build
build: ## Build backend service
	@echo "$(GREEN)Building backend service...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build

.PHONY: build-no-cache
build-no-cache: ## Build backend service without cache
	@echo "$(GREEN)Building backend service without cache...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build --no-cache

.PHONY: pull
pull: ## Pull latest Node.js image
	@echo "$(GREEN)Pulling latest images...$(NC)"
	docker-compose -f $(COMPOSE_FILE) pull

## Service Management

.PHONY: logs
logs: ## Show logs for backend service
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: logs-backend
logs-backend: ## Show backend service logs
	docker-compose -f $(COMPOSE_FILE) logs -f backend

.PHONY: backend-shell
backend-shell: ## Connect to backend container shell
	docker-compose -f $(COMPOSE_FILE) exec backend /bin/bash

.PHONY: ps
ps: ## Show running containers
	docker-compose -f $(COMPOSE_FILE) ps

## Cleanup Commands

.PHONY: clean
clean: ## Remove stopped containers and unused images
	@echo "$(YELLOW)Cleaning up containers and images...$(NC)"
	docker container prune -f
	docker image prune -f

.PHONY: clean-all
clean-all: ## Remove all containers, images, volumes, and networks
	@echo "$(RED)WARNING: This will remove ALL Docker resources!$(NC)"
	@read -p "Are you sure? [y/N]: " confirm && [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]
	docker system prune -a -f --volumes

## Environment

.PHONY: env-example
env-example: ## Create example environment file
	@echo "$(GREEN)Creating .env.example file...$(NC)"
	@echo "PORT=10000" > .env.example
	@echo "MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=sms" >> .env.example
	@echo "JWT_SECRET=your-super-secret-jwt-key-here" >> .env.example
	@echo "NODE_ENV=production" >> .env.example
	@echo "Created .env.example - copy to .env and update values"

.PHONY: check-env
check-env: ## Check if required environment variables are set
	@echo "$(GREEN)Checking environment variables...$(NC)"
	@if [ ! -f .env ]; then echo "$(RED)Error: .env file not found!$(NC)"; exit 1; fi
	@grep -q "MONGO_URI" .env || (echo "$(RED)Error: MONGO_URI not set in .env$(NC)" && exit 1)
	@grep -q "JWT_SECRET" .env || (echo "$(RED)Error: JWT_SECRET not set in .env$(NC)" && exit 1)
	@echo "$(GREEN)Environment variables check passed!$(NC)"

## MongoDB Commands

.PHONY: test-mongo
test-mongo: ## Test MongoDB connection
	@echo "$(GREEN)Testing MongoDB connection...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend node test-mongo-connection.js

## Help

.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Quick start:$(NC)"
	@echo "  1. Ensure you have .env file with MONGO_URI and JWT_SECRET"
	@echo "  2. Start development: $(YELLOW)make dev$(NC)"
	@echo "  3. View logs: $(YELLOW)make logs$(NC)"
	@echo "  4. Stop services: $(YELLOW)make down$(NC)"
