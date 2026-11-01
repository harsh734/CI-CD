# Deployment Guide — fullstack-todo-list

Complete documentation for deploying this app to a production VPS, from purchasing the VPS to setting up automatic CI/CD deployment.

> **Stack:** React (Vite) + Express + PostgreSQL, packaged with Docker, served through Nginx, deployed to an Ubuntu VPS, with CI/CD using GitHub Actions.

---

## Table of Contents

* [1. Architecture Overview](#1-architecture-overview)
* [2. Initial VPS Setup](#2-initial-vps-setup)
* [3. First Deployment (Manual)](#3-first-deployment-manual)
* [4. CI/CD Setup (GitHub Actions)](#4-cicd-setup-github-actions)
* [5. Daily Workflow](#5-daily-workflow)
* [6. Troubleshooting](#6-troubleshooting)
* [7. Quick Reference](#7-quick-reference)

---

## 1. Architecture Overview

### Deployment Flow

```text
You code on your Mac
        │
        │ git push origin main
        ▼
GitHub repository
        │
        │ trigger .github/workflows/deploy.yml
        ▼
GitHub Actions runner
        │
        │ SSH using a dedicated key
        ▼
VPS: git pull + docker compose up -d --build
        │
        ▼
New website live at http://<VPS_IP>
```

### Runtime Architecture on VPS

```text
                    Internet
                       │
                 http://<IP>:80
                       │
                       ▼
        ┌─────────────────────────────┐
        │  fe  (Nginx, serve static)  │
        │  ← only this container      │
        │    is exposed externally    │
        └──┬──────────────────────────┘
           │ proxy /api/* → be:5000
           ▼
        ┌─────────────────────────────┐
        │  be  (Express, port 5000)   │
        │  ← accessible internally    │
        └──┬──────────────────────────┘
           │ pg client → postgres:5432
           ▼
        ┌─────────────────────────────┐
        │  postgres  (port 5432)      │
        │  ← accessible internally    │
        └─────────────────────────────┘
                   │
                   ▼
        Named volume `pgdata`
        (data persists across restarts)
```

All 3 services are inside the **default Docker network** created by Compose and can resolve each other using their service names (`be`, `postgres`, `fe`).

### Main Files

| File                                       | Purpose                                                     |
| ------------------------------------------ | ----------------------------------------------------------- |
| `infrastructure/docker-compose.prod.yml`   | Production Compose: 3 services, only port 80 exposed        |
| `infrastructure/docker/be.prod.Dockerfile` | Backend: `npm ci --omit=dev` + `node server.js`             |
| `infrastructure/docker/fe.prod.Dockerfile` | Frontend: multi-stage Vite build → Nginx serve              |
| `infrastructure/docker/nginx.conf`         | SPA fallback + proxy `/api/` → backend                      |
| `infrastructure/.env.prod.example`         | Environment variable template (copy to `.env.prod` on VPS)  |
| `infrastructure/Makefile`                  | Shortcuts: `make prod-up`, `prod-logs`, `prod-deploy`, ...  |
| `.github/workflows/deploy.yml`             | GitHub Actions: automatically deploy when pushing to `main` |

---

## 2. Initial VPS Setup

This section only needs to be done **once** when you first purchase the VPS.

### 2.1. Purchase a VPS

**Recommended minimum configuration:**

* CPU: 1 vCPU
* RAM: **2 GB** (1 GB may run out of memory during `vite build`)
* Disk: 20–40 GB SSD
* OS: **Ubuntu 22.04 or 24.04 LTS**
* Location: HN or HCM (for Vietnamese users)

**Setup during purchase (on the provider's website):**

* Automatic Backup: **Disabled** (costs 20% extra and is unnecessary for practice)
* Enable IPv6: **Enabled** (usually free)
* Private Network/VPC: **Disabled** (only needed when using multiple VPSs)
* **SSH Key: paste your Mac's public key** (get it using `cat ~/.ssh/id_ed25519.pub`; create it first with `ssh-keygen -t ed25519` if you don't have one)
* Quantity: 1
* Server name: choose your own, e.g. `vps-todo`

After purchasing, you will receive the **public IP address** through email/dashboard.

### 2.2. SSH into the VPS for the First Time

On your Mac:

```bash
ssh root@<VPS_IP>
```

The first time, it will ask `yes/no` → enter `yes`.

You should enter the root prompt directly because the SSH key was added during VPS creation.

### 2.3. Update the System

```bash
apt update && apt upgrade -y
```

### 2.4. Disable SSH Password Login

```bash
nano /etc/ssh/sshd_config
```

Change the following 2 lines (remove the `#` at the beginning if present):

```text
PermitRootLogin prohibit-password
PasswordAuthentication no
```

> `prohibit-password` means root can still log in, but **only through an SSH key**. Password authentication is blocked.

Apply the changes:

```bash
systemctl restart ssh
```

**Verify** from a new Mac terminal. Do not close the current terminal yet:

```bash
ssh root@<VPS_IP>
```

You should still be able to log in using the SSH key.

If successful → password authentication has been completely disabled.

### 2.5. Firewall (UFW)

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp

ufw --force enable

ufw status
```

### 2.6. Install Docker

```bash
curl -fsSL https://get.docker.com | sh

docker --version && docker compose version

docker run --rm hello-world   # verify
```

### 2.7. Create a 2 GB Swap File

This provides extra memory protection when `vite build` consumes a lot of RAM.

```bash
fallocate -l 2G /swapfile

chmod 600 /swapfile

mkswap /swapfile

swapon /swapfile

echo '/swapfile none swap sw 0 0' >> /etc/fstab

free -h   # should show Swap: 2.0Gi
```

### 2.8. Install Make

```bash
apt install -y make
```

### 2.9. Configure Git Identity

This is only to avoid warnings when running `git pull`.

```bash
git config --global user.name "Truong Nguyen Bao Khang"

git config --global user.email "khangbixanh051107@gmail.com"
```

---

## 3. First Deployment (Manual)

### 3.1. Clone the Repository

```bash
cd /root

git clone https://github.com/kevintruong0511/fullstack-todo-list.git

cd fullstack-todo-list
```

> The folder will be `/root/fullstack-todo-list`. This path must match the path configured in the deployment workflow.

### 3.2. Create `.env.prod`

```bash
cd infrastructure

cat > .env.prod <<EOF

POSTGRES_USER=todo_user

POSTGRES_PASSWORD=$(openssl rand -base64 24)

POSTGRES_DB=todo_db

JWT_SECRET=$(openssl rand -base64 48)

JWT_EXPIRES_IN=7d

HTTP_PORT=80

EOF

cat .env.prod   # verify
```

> `.env.prod` is already gitignored. This file exists only on the VPS and should never be committed to the repository.

### Using Amazon RDS

To use RDS instead of the bundled PostgreSQL container, set these values in `infrastructure/.env.prod`:

```dotenv
DB_HOST=<your-rds-endpoint>
DB_PORT=5432
DB_USER=<your-rds-username>
DB_PASSWORD=<your-rds-password>
DB_NAME=<your-rds-database>
DB_SSL=true
```

With `DB_SSL=true`, the backend verifies the RDS server certificate (`rejectUnauthorized: true`). Ensure the Node.js runtime trusts the current Amazon RDS CA certificate. Keep the RDS security group restricted to connections from your backend host. Leave `DB_SSL=false` when using the bundled PostgreSQL service.

### 3.3. Build & Start the Stack

```bash
make prod-up
```

The first build may take **5–10 minutes** because the frontend and backend are being built from scratch. The swap file helps when RAM usage becomes high.

View real-time logs:

```bash
make prod-logs
```

When you see:

```text
Server is running on http://localhost:5000
```

the stack is running.

Press `Ctrl+C` to exit the logs.

Verify:

```bash
make prod-ps   # 3 services should be Up, postgres should be healthy
```

### 3.4. Test from the Browser

Open:

```text
http://<VPS_IP>
```

on your Mac.

The React application should load, and requests to `/api/...` should return `200` or `401`, not CORS or `502` errors.

---

## 4. CI/CD Setup (GitHub Actions)

This section only needs to be done **once**, after the manual deployment is working correctly.

### 4.1. Create a Dedicated SSH Key for CI

Create a separate key from your personal SSH key so it can be revoked independently.

On your Mac:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/todo_deploy_ci -N "" -C "github-actions-todo"
```

This creates 2 files:

* `~/.ssh/todo_deploy_ci` — private key (paste into GitHub Secret)
* `~/.ssh/todo_deploy_ci.pub` — public key (add to the VPS)

### 4.2. Add the Public Key to the VPS

Quick method:

```bash
cat ~/.ssh/todo_deploy_ci.pub | ssh root@<VPS_IP> "cat >> ~/.ssh/authorized_keys"
```

Verify from your Mac:

```bash
ssh -i ~/.ssh/todo_deploy_ci root@<VPS_IP> 'echo CI key OK'
```

If it prints:

```text
CI key OK
```

without asking for anything → **OK**.

### 4.3. Add 3 Secrets to GitHub

Go to:

**GitHub repository → Settings → Secrets and variables → Actions → New repository secret**

Create:

| Name          | Value                                                                           |
| ------------- | ------------------------------------------------------------------------------- |
| `VPS_HOST`    | `<VPS_IP>`                                                                      |
| `VPS_USER`    | `root`                                                                          |
| `VPS_SSH_KEY` | Entire contents of `~/.ssh/todo_deploy_ci`, including the `BEGIN` / `END` lines |

⚠️ **When pasting `VPS_SSH_KEY`:**

Use:

```bash
cat ~/.ssh/todo_deploy_ci | pbcopy
```

Then press `Cmd+V`.

Manually copying the key can accidentally remove newlines, causing GitHub to report:

```text
ssh: no key found
```

### 4.4. Workflow File

The workflow already exists at:

`.github/workflows/deploy.yml`

Triggers:

* Push to the `main` branch → automatic deployment
* `workflow_dispatch` → manual trigger from the Actions tab

Commands executed on the VPS:

```bash
cd /root/fullstack-todo-list

git pull origin main

cd infrastructure

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

docker image prune -f
```

### 4.5. Trigger the First Run

On your Mac:

```bash
git add .github/workflows/deploy.yml

git commit -m "ci: add auto-deploy"

git push origin main
```

View the workflow at:

`https://github.com/kevintruong0511/fullstack-todo-list/actions`

---

## 5. Daily Workflow

After setup is complete, deployment requires only:

```bash
# On your Mac, inside the repository folder

git add .

git commit -m "feat: add feature X"

git push origin main
```

The workflow automatically runs → approximately 2–5 minutes later, the website is updated.

### Monitor

* GitHub Actions tab: real-time logs
* Email notification when the workflow fails (enable at `https://github.com/settings/notifications`)

### Trigger the Workflow Again Without a Commit

Go to:

**Actions → "Deploy to VPS" workflow → Run workflow**

using the button in the top-right corner.

---

## 6. Troubleshooting

### Workflow Fails Immediately (~10s) with `ssh: no key found`

The private key stored in the `VPS_SSH_KEY` secret has an incorrect format.

Re-copy it using `pbcopy`:

```bash
cat ~/.ssh/todo_deploy_ci | pbcopy
```

Then update the secret on GitHub.

### Workflow Fails Immediately with `Permission denied (publickey)`

The public key has not been correctly added to `~/.ssh/authorized_keys` on the VPS.

Verify:

```bash
ssh root@<VPS_IP> 'cat ~/.ssh/authorized_keys'
```

The key should contain:

```text
github-actions-todo
```

If it is missing → go back to step 4.2.

### `cd: /***/...: No such file or directory`

The folder path in the workflow does not match the folder path on the VPS.

Change:

```bash
cd /root/fullstack-todo-list
```

in `.github/workflows/deploy.yml` to the correct path.

> GitHub masks `root` in the logs because `VPS_USER=root` is a secret. Therefore, reading `/***/fullstack-todo-list` means `/root/fullstack-todo-list`.

### Build Times Out After 15 Minutes

Increase:

```yaml
command_timeout: 30m
```

in the workflow.

### `docker compose up` Reports `unhealthy` for PostgreSQL

Check the PostgreSQL logs:

```bash
ssh root@<VPS_IP> 'cd /root/fullstack-todo-list/infrastructure && make prod-logs-db'
```

Common causes are missing variables in `.env.prod` or incorrect database credentials.

### Website Loads but API Returns 502

The backend container has crashed.

Check:

```bash
make prod-logs-be
```

Common causes:

* `.env.prod` is missing `JWT_SECRET`
* Backend cannot connect to PostgreSQL

### Out of Memory During Build

The swap may be full or may not exist.

Check:

```bash
free -h
```

If:

```text
Swap = 0
```

go back to step 2.7 and create the swap file.

### `git pull` Requests Credentials in the Workflow

This can happen when the repository is private and a PAT has not been cached on the VPS.

SSH into the VPS and perform the pull manually once:

```bash
ssh root@<VPS_IP>

cd /root/fullstack-todo-list

git config --global credential.helper store

git pull origin main   # enter PAT when prompted; it will be saved
```

---

## 7. Quick Reference

### Makefile Commands

Run these inside:

```text
/root/fullstack-todo-list/infrastructure/
```

| Command                              | Purpose                                       |
| ------------------------------------ | --------------------------------------------- |
| `make prod-up`                       | Start the stack (build + detached)            |
| `make prod-down`                     | Stop the stack (keep data)                    |
| `make prod-logs`                     | Tail logs from all services                   |
| `make prod-logs-be` / `-fe` / `-db`  | Tail logs from one service                    |
| `make prod-ps`                       | List running services                         |
| `make prod-shell-be` / `-fe` / `-db` | Open a shell inside a container (psql for DB) |
| `make prod-restart`                  | Restart all services                          |
| `make prod-rebuild`                  | Rebuild without cache                         |
| `make prod-deploy`                   | git pull + rebuild + prune (run on VPS)       |

### SSH Shortcuts

Add the following to:

```text
~/.ssh/config
```

```text
Host todo-vps
    HostName <VPS_IP>
    User root
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    ServerAliveInterval 60
```

Then:

* Terminal: `ssh todo-vps`
* VS Code: `Cmd+Shift+P` → `Remote-SSH: Connect to Host` → `todo-vps`

### Manual Database Backup

```bash
ssh root@<VPS_IP>

cd /root/fullstack-todo-list/infrastructure

docker compose -f docker-compose.prod.yml --env-file .env.prod exec postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > ~/backup-$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod exec -T postgres \
  psql -U "$POSTGRES_USER" "$POSTGRES_DB" < ~/backup-YYYYMMDD.sql
```

### URLs

| Resource          | URL                                                                               |
| ----------------- | --------------------------------------------------------------------------------- |
| Web app           | `http://<VPS_IP>`                                                                 |
| GitHub repository | `https://github.com/kevintruong0511/fullstack-todo-list`                          |
| GitHub Actions    | `https://github.com/kevintruong0511/fullstack-todo-list/actions`                  |
| GitHub Secrets    | `https://github.com/kevintruong0511/fullstack-todo-list/settings/secrets/actions` |

---

## Out of Scope (To Do Later)

* **Domain + HTTPS**: purchase a domain, point the DNS A record → IP, add Certbot/nginx-proxy-companion → HTTPS through Let's Encrypt
* **Automatic backups**: cron job with `pg_dump` + upload to S3/Drive
* **Monitoring**: Uptime Robot (free) pinging the endpoint every 5 minutes
* **CI checks before deployment**: add a `lint` job running `eslint` before the `deploy` job
* **Staging environment**: a second VPS for the `develop` branch
* **Database migrations**: currently relies on `initPostgres` running during startup. When the schema becomes more complex → use a tool such as `node-pg-migrate` or `knex migrate`
