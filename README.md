## Getting Started

### 🐳 Docker (Recommended)

> Make sure **Docker Desktop** is installed and running.

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (NestJS) | http://localhost:8000 |

> Next time after built:
> ```bash
> docker compose up
> ```

---

### Manual Setup

#### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```