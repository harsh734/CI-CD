COMPOSE = docker compose
COMPOSE_PROD = docker compose -f docker-compose.prod.yml --env-file .env.prod

.PHONY: help up up-d down down-v build rebuild restart logs logs-be logs-fe logs-db ps shell-be shell-fe shell-db clean \
        prod-up prod-up-fg prod-down prod-build prod-rebuild prod-restart prod-logs prod-logs-be prod-logs-fe prod-logs-db \
        prod-ps prod-shell-be prod-shell-fe prod-shell-db prod-deploy

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

up: ## Start all services (foreground, with build)
	$(COMPOSE) up --build

up-d: ## Start all services (detached)
	$(COMPOSE) up --build -d

down: ## Stop all services (keep data)
	$(COMPOSE) down

down-v: ## Stop all services AND wipe postgres data
	$(COMPOSE) down -v

build: ## Build images without starting
	$(COMPOSE) build

rebuild: ## Rebuild images from scratch (no cache)
	$(COMPOSE) build --no-cache

restart: ## Restart all services
	$(COMPOSE) restart

logs: ## Tail logs from all services
	$(COMPOSE) logs -f

logs-be: ## Tail backend logs
	$(COMPOSE) logs -f be

logs-fe: ## Tail frontend logs
	$(COMPOSE) logs -f fe

logs-db: ## Tail postgres logs
	$(COMPOSE) logs -f postgres

ps: ## List running services
	$(COMPOSE) ps

shell-be: ## Open shell in backend container
	$(COMPOSE) exec be sh

shell-fe: ## Open shell in frontend container
	$(COMPOSE) exec fe sh

shell-db: ## Open psql in postgres container
	$(COMPOSE) exec postgres psql -U postgres -d todo_db

clean: ## Stop, remove volumes and prune dangling images
	$(COMPOSE) down -v
	docker image prune -f

# ─── Production targets ──────────────────────────────────────
# All prod-* targets use docker-compose.prod.yml + .env.prod.
# Run on the VPS (or locally to smoke-test the prod build).
# `.env.prod` must exist next to this Makefile — copy from .env.prod.example.

prod-up: ## [prod] Start prod stack (detached, with build)
	$(COMPOSE_PROD) up -d --build

prod-up-fg: ## [prod] Start prod stack (foreground, useful to see startup errors)
	$(COMPOSE_PROD) up --build

prod-down: ## [prod] Stop prod stack (KEEP postgres data)
	$(COMPOSE_PROD) down

prod-build: ## [prod] Build prod images without starting
	$(COMPOSE_PROD) build

prod-rebuild: ## [prod] Rebuild prod images from scratch (no cache)
	$(COMPOSE_PROD) build --no-cache

prod-restart: ## [prod] Restart all prod services
	$(COMPOSE_PROD) restart

prod-logs: ## [prod] Tail logs from all prod services
	$(COMPOSE_PROD) logs -f

prod-logs-be: ## [prod] Tail prod backend logs
	$(COMPOSE_PROD) logs -f be

prod-logs-fe: ## [prod] Tail prod frontend logs
	$(COMPOSE_PROD) logs -f fe

prod-logs-db: ## [prod] Tail prod postgres logs
	$(COMPOSE_PROD) logs -f postgres

prod-ps: ## [prod] List running prod services
	$(COMPOSE_PROD) ps

prod-shell-be: ## [prod] Open shell in prod backend container
	$(COMPOSE_PROD) exec be sh

prod-shell-fe: ## [prod] Open shell in prod frontend (nginx) container
	$(COMPOSE_PROD) exec fe sh

prod-shell-db: ## [prod] Open psql in prod postgres container
	$(COMPOSE_PROD) exec postgres sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

prod-deploy: ## [prod] git pull + rebuild + restart + prune (run this on the VPS)
	cd .. && git pull
	$(COMPOSE_PROD) up -d --build
	docker image prune -f
