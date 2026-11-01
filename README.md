# 📝 Todo Web — Full-stack Task Management

A **Todo / Task Management** full-stack application built with a production-ready deployment approach, rather than being designed to run only locally. The entire stack is packaged using **Docker**, with **2 separate environments (dev / prod)** and **automated CI/CD** from GitHub Actions → VPS.

> Project goal: practice the complete **dev → build → ship → deploy** workflow for a small web application — from local development to running on a real VPS after every `git push`.

---

## 🧱 Overall Architecture

```text
┌────────────────────┐        ┌────────────────────┐        ┌────────────────────┐
│      Browser       │ ─────▶ │   Nginx (fe:80)    │ ─────▶ │  Express (be:5000) │
│  (React + Vite)    │  /api  │  serve static +    │  HTTP  │   Node.js + JWT    │
│                    │ ─────▶ │  reverse-proxy     │ ─────▶ │                    │
└────────────────────┘        └────────────────────┘        └─────────┬──────────┘
                                                                       │
                                                                       ▼
                                                            ┌────────────────────┐
                                                            │  PostgreSQL 16     │
                                                            │   (volume pgdata)  │
                                                            └────────────────────┘
```

* **Frontend** (`fe/`): React 19 + Vite 8, Redux Toolkit, React Router, Axios.
* **Backend** (`be/`): Node.js + Express 4, JWT authentication, Swagger documentation (`/api-docs`).
* **Database**: PostgreSQL 16 (Alpine), with data persisted in the Docker volume `pgdata`.
* **Reverse proxy (prod)**: Nginx serves static frontend files and proxies `/api` → backend.
* **Infrastructure**: Docker Compose, with 2 separate files for **dev** and **prod**.

---

## 📂 Directory Structure

```text
Todo-Web/

├── be/                          # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── app/                # auth/, task/, user/ modules
│   │   ├── configs/
│   │   ├── middlewares/
│   │   └── app.js
│   ├── server.js
│   ├── db.js
│   ├── swagger.json
│   └── package.json

├── fe/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/               # Dashboard, Login, Register, TaskList, ...
│   │   ├── components/          # auth/, layout/, ui/
│   │   ├── redux/
│   │   └── api/
│   └── package.json

├── infrastructure/              # Docker & deployment
│   ├── docker/
│   │   ├── be.Dockerfile        # dev
│   │   ├── be.prod.Dockerfile   # prod
│   │   ├── fe.Dockerfile        # dev
│   │   ├── fe.prod.Dockerfile   # prod (multi-stage build → nginx)
│   │   └── nginx.conf            # prod reverse-proxy config
│   ├── docker-compose.yml        # dev stack
│   ├── docker-compose.prod.yml   # prod stack
│   ├── .env.prod.example
│   └── Makefile                  # shortcuts for dev & prod

└── .github/workflows/
    └── deploy.yml                # CI/CD: push main → SSH into VPS → rebuild
```

---

## 🚀 Tech Stack

| Layer          | Technology                                           |
| -------------- | ---------------------------------------------------- |
| Frontend       | React 19, Vite 8, Redux Toolkit, React Router 7      |
| Backend        | Node.js 20, Express 4, JWT, bcryptjs                 |
| Database       | PostgreSQL 16                                        |
| Infrastructure | Docker, Docker Compose, Nginx                        |
| CI/CD          | GitHub Actions + `appleboy/ssh-action`               |
| Hosting        | VPS (Ubuntu / Debian-like, with Docker + Compose v2) |

---

## 🧑‍💻 Running the Development Environment

Everything runs inside Docker — **you do not need to install Node or PostgreSQL on the host machine**.

### Requirements

* Docker Desktop (or Docker Engine + Compose v2)
* `be/.env` file (copy from `be/.env.example` if it does not exist)

### Commands

```bash
cd infrastructure
docker compose up --build

# or use the Makefile:
make up
```

| Service      | URL                                      |
| ------------ | ---------------------------------------- |
| Frontend     | http://localhost:5173                    |
| Backend API  | http://localhost:5001                    |
| Swagger docs | http://localhost:5001/api-docs           |
| Health check | http://localhost:5001/health             |
| PostgreSQL   | `localhost:5435` (user/pass: `postgres`) |

### Hot Reload

* **Backend**: edit files inside `be/`; the container automatically restarts (`node --watch`).
* **Frontend**: edit files inside `fe/`; the browser automatically updates using HMR (Vite + polling for macOS).

For more details, see [`infrastructure/README.md`](infrastructure/README.md).

---

## 🏭 Production Stack

Compared with development:

* The frontend is **built as static files** and served using **Nginx** (multi-stage Dockerfile).
* Nginx both serves the static files and **reverse-proxies `/api` → backend** → the frontend only needs to call `/api/...` (same origin → no CORS).
* The backend runs `node server.js` (without `--watch`), with `NODE_ENV=production`, and dependencies installed using `npm ci --omit=dev`.
* PostgreSQL uses **real credentials** from `.env.prod` (`infrastructure/.env.prod.example`), instead of `postgres/postgres`.
* PostgreSQL **does not expose its port** to the host — it is accessible only through the internal Docker network.
* The frontend container exposes `HTTP_PORT` (default `80`) externally.

### Run the Production Stack Locally

```bash
cd infrastructure

cp .env.prod.example .env.prod

# Edit POSTGRES_PASSWORD and JWT_SECRET.
# Change HTTP_PORT=8080 if port 80 is already in use.

make prod-up

# → Open http://localhost:8080
```

---

## 🤖 CI/CD — Automatic Deployment When Pushing to `main`

The pipeline is simple and straightforward. File:

`.github/workflows/deploy.yml`

### Overall Workflow

```text
git push origin main
        │
        ▼
┌──────────────────────────┐
│  GitHub Actions runner   │
│  (ubuntu-latest)         │
│                          │
│  appleboy/ssh-action     │
│  → SSH into VPS          │
└──────────────┬───────────┘
               │ ssh user@vps
               ▼
┌──────────────────────────────────────────────────┐
│ VPS (/root/todo-web)                             │
│  1. git pull origin main                         │
│  2. cd infrastructure                            │
│  3. docker compose -f docker-compose.prod.yml \  │
│       --env-file .env.prod up -d --build         │
│  4. docker image prune -f                        │
│  5. docker compose ps  (verify)                  │
└──────────────────────────────────────────────────┘
```

### Trigger

* **Automatic**: every `push` to the `main` branch.
* **Manual**: **Actions → Deploy to VPS → Run workflow** (`workflow_dispatch`).

### GitHub Secrets Required

Go to:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret        | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| `VPS_HOST`    | VPS IP address or domain (e.g. `123.45.67.89`)                         |
| `VPS_USER`    | SSH user (e.g. `root`, or a user with permission to run Docker)        |
| `VPS_SSH_KEY` | **Private key** (PEM) corresponding to the public key added to the VPS |

> Note: `VPS_SSH_KEY` must contain the **entire private key file**, including the `-----BEGIN/END...-----` lines. It is not a file path.

---

## 🖥 Initial VPS Setup

These steps need to be performed **once** on the VPS before the pipeline can run.

### 1. Install Docker + Compose v2

```bash
# Ubuntu/Debian

curl -fsSL https://get.docker.com | sh

sudo usermod -aG docker $USER   # log out/in again for the change to take effect

docker compose version           # should output v2.x
```

### 2. Create an SSH Key for GitHub Actions

On your **local machine** (or on the VPS and then copy the private key to your local machine):

```bash
ssh-keygen -t ed25519 -C "gh-actions" -f ~/.ssh/todo_deploy

# → creates todo_deploy (private) and todo_deploy.pub (public)
```

On the **VPS**, add the public key:

```bash
cat todo_deploy.pub >> ~/.ssh/authorized_keys

chmod 600 ~/.ssh/authorized_keys
```

Paste the contents of the **private key** (`todo_deploy`) into the GitHub Secret `VPS_SSH_KEY`.

### 3. Clone the Repository to the VPS

The pipeline expects the repository to be located at `/root/todo-web` (see `deploy.yml:23`).

```bash
cd /root

git clone https://github.com/<your-username>/Todo-Web.git todo-web

cd todo-web/infrastructure

cp .env.prod.example .env.prod

# Edit .env.prod:
# change POSTGRES_PASSWORD and JWT_SECRET to real values

# JWT_SECRET can be generated using:
openssl rand -base64 48
```

### 4. Open Ports

* `80` (HTTP) — required for the frontend Nginx server to be accessible externally.
* `22` (SSH) — required for GitHub Actions to connect via SSH.
* (Optional) `443` if HTTPS is added later (Let's Encrypt / Caddy / Traefik).

### 5. Build & Start for the First Time

```bash
cd /root/todo-web/infrastructure

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

docker compose -f docker-compose.prod.yml --env-file .env.prod ps
```

Visit:

```text
http://<VPS_HOST>/
```

→ The application should now be running.

From this point onward, every:

```bash
git push origin main
```

will automatically deploy the application again.

---

## 🧰 Makefile — Common Commands

`infrastructure/Makefile` contains shortcuts for commonly used commands for both **dev** and **prod**.

### Dev (Local)

```bash
make up           # start dev stack (foreground)

make up-d         # start detached

make down         # stop, keep data

make down-v       # stop + remove PostgreSQL data

make logs-be      # tail backend logs

make shell-db     # open psql inside the PostgreSQL container

make rebuild      # rebuild from scratch (no-cache)
```

### Prod (VPS or Local Smoke Test)

```bash
make prod-up        # build + start detached

make prod-up-fg     # foreground to view startup errors

make prod-logs      # tail all logs

make prod-ps        # list running services

make prod-deploy    # git pull + rebuild + restart + prune
```

Run:

```bash
make help
```

to see all available targets.

---

## 🔐 Security & Best Practices

* **DO NOT commit** `.env`, `.env.prod`, or any file containing secrets — these files are already included in `.gitignore`.
* Generate the JWT secret using:

```bash
openssl rand -base64 48
```

* The PostgreSQL password in production **must not be the same as in development** (`postgres/postgres`).
* The PostgreSQL container in production **does not expose its port** to the host — it can only be accessed through the internal Docker network. To connect to the database externally for debugging, use an SSH tunnel.
* When rotating secrets, update `.env.prod` on the VPS and run:

```bash
make prod-restart
```

---

## 🧪 API Quick Reference

Swagger UI:

```text
http://<host>:5001/api-docs
```

(dev)

or:

```text
http://<host>/api-docs
```

(prod)

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Log in → returns JWT     |
| GET    | `/api/tasks`         | Get the user's task list |
| POST   | `/api/tasks`         | Create a new task        |
| PUT    | `/api/tasks/:id`     | Update a task            |
| DELETE | `/api/tasks/:id`     | Delete a task            |
| GET    | `/health`            | Health check             |

---

## 🐛 Troubleshooting

| Symptom                                        | Common Cause                                                                                  | Solution                                                                                      |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `port 80 is already allocated`                 | Another service (Apache/Nginx) is already using port 80                                       | Change `HTTP_PORT=8080` in `.env.prod`, or stop the other service                             |
| FE loads but API returns 404 / CORS            | Nginx cannot proxy `/api` → backend has not started or there is a network configuration issue | Run `make prod-logs-be`, `make prod-logs-fe`                                                  |
| GitHub Actions fails during SSH                | `VPS_SSH_KEY` has an incorrect format, or the public key has not been added to the VPS        | Test manually: `ssh -i todo_deploy user@host`                                                 |
| Build is slow / VPS runs out of disk space     | Too many old Docker images                                                                    | The pipeline already runs `docker image prune -f`. Run `docker system prune -af` if necessary |
| Database resets / data is lost after `down -v` | `-v` removes the `pgdata` volume                                                              | Do not use `down -v` in production. Back up the volume before upgrading                       |

---

## 📌 Roadmap

* [ ] Automatic HTTPS using Caddy / Traefik + Let's Encrypt
* [ ] Build & push Docker images to a registry (GHCR) instead of building on the VPS
* [ ] Automatic health checks + rollback in the pipeline
* [ ] Separate test job (lint + unit tests) before deployment
* [ ] Regular PostgreSQL backups to object storage (S3 / R2)

---

## 👨‍💻 Author

**Truong Nguyen Bao Khang** — practice project for learning full-stack development + basic DevOps.
