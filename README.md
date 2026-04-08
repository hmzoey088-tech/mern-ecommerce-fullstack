# NexaShop — Premium E-Commerce Platform

NexaShop is a production-grade MERN monorepo scaffold for a portfolio-quality e-commerce platform.

## Workspace structure

- `/client` — React 18 + Vite + Tailwind + Redux Toolkit
- `/server` — Express.js + Node.js + MongoDB + JWT auth
- `/shared` — Shared constants and types
- `docker-compose.yml` — Local development containers
- `.env.example` — Environment variable blueprint

## Getting started

1. Copy `.env.example` to `.env` and fill in secrets.
2. Install dependencies in each workspace: `npm install`.
3. Run backend and frontend via `docker compose up` or from each workspace.
