# Makefile for common project tasks

# Use docker compose V2 syntax
COMPOSE = docker compose

# Default target when running 'make' without arguments
DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Start backend and frontend in development mode (watch)
	$(COMPOSE) watch backend frontend

.PHONY: dev-backend
dev-backend: ## Start only backend in development mode (watch)
	$(COMPOSE) watch backend

.PHONY: dev-frontend
dev-frontend: ## Start only frontend in development mode (watch)
	$(COMPOSE) watch frontend

.PHONY: up
up: ## Start backend and frontend in detached mode
	$(COMPOSE) up -d backend frontend

.PHONY: up-backend
up-backend: ## Start only backend in detached mode
	$(COMPOSE) up -d backend

.PHONY: start-backend
start-backend: ## Start only backend in detached mode
	$(COMPOSE) exec backend bash -c "fastapi run --reload app/main.py"

.PHONY: up-frontend
up-frontend: ## Start only frontend in detached mode
	$(COMPOSE) up -d frontend

.PHONY: down
down: ## Stop and remove containers
	$(COMPOSE) down

.PHONY: bash-backend
bash-backend: ## Access the bash shell inside the backend container
	$(COMPOSE) exec backend bash

.PHONY: test
test: ## Run tests inside the backend container (adjust path/command if needed)
	$(COMPOSE) exec backend pytest app/tests

.PHONY: makemigrations
makemigrations: ## Generate Alembic migration with message: make makemigrations m="Your message"
	@if [ -z "$(m)" ]; then \
		echo "Error: Migration message is required."; \
		echo "Usage: make makemigrations m=\"Your migration message\""; \
		exit 1; \
	fi
	$(COMPOSE) exec backend alembic revision --autogenerate -m "$(m)"

.PHONY: migrate
migrate: ## Apply Alembic migrations inside the backend container
	$(COMPOSE) exec backend alembic upgrade head
