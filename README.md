# AITC Property Preservation & BPO Management System

[![CI](https://github.com/Mausd34/aitc-property-bpo-management-group-project-/actions/workflows/ci.yml/badge.svg)](https://github.com/Mausd34/aitc-property-bpo-management-group-project-/actions/workflows/ci.yml)

A full-stack property preservation and BPO operations platform built with **Django REST Framework + React/Vite**, designed to manage clients, properties, work orders, vendors, assignments, QA, documents, notifications, reports, and operational dashboards.

## 🌐 Live Demo

**Live application:** https://aitc-property-bpo-management-group-7r88.onrender.com/

## ✨ Core Modules

- 🔐 User access and authentication UI
- 📊 Dashboard and operational statistics
- 👥 Client management
- 🏠 Property management with images
- 📋 Work order lifecycle and priorities
- 🔧 Vendor management
- 🚚 Dispatch and assignment tracking
- ✅ QA review workflow
- 📄 Documents
- 🔔 Notifications
- 📈 Reports and analytics
- 🧭 Searchable management views

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Backend | Python, Django 5.2, Django REST Framework |
| Frontend | React 18, Vite 5 |
| Database | PostgreSQL in production, SQLite fallback for local development |
| Media | Pillow / Django media handling |
| Production | Gunicorn, WhiteNoise, Render-compatible configuration |
| CI | GitHub Actions |

## 📁 Project Structure

```text
.
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── ... Django apps/settings
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ... Vite/React files
├── .github/
│   └── workflows/ci.yml
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

## 🚀 Run Locally

### 1. Backend

```bash
cd backend
python -m venv venv
```

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, use Command Prompt:

```cmd
venv\Scripts\activate.bat
```

Install and migrate:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Backend: `http://127.0.0.1:8000/`

API: `http://127.0.0.1:8000/api/`

Admin: `http://127.0.0.1:8000/admin/`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173/`

### 3. Production build check

```bash
cd frontend
npm run build
```

```bash
cd backend
python manage.py check
```

These checks are also executed automatically by GitHub Actions on pushes and pull requests to `main`.

## 🔐 Environment Configuration

Copy `backend/.env.example` to your local environment and replace the placeholder values. Never commit real passwords, API keys, Django secret keys, or production database credentials.

For production, configure `DATABASE_URL` for PostgreSQL. SQLite is intended only as a convenient local-development fallback.

## 🧪 Development Workflow

Use focused branches and meaningful commits:

```bash
git checkout -b feature/work-order-filters
git add .
git commit -m "feat: add work order filters"
git push origin feature/work-order-filters
```

Before opening a pull request, run:

```bash
cd backend && python manage.py check
cd ../frontend && npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and pull-request guidelines.

## 📌 Roadmap

- [ ] Replace demo login with production authentication/JWT flow
- [ ] Add automated backend API tests
- [ ] Add frontend component tests
- [ ] Add role-based permissions
- [ ] Add advanced work-order filtering and pagination
- [ ] Add richer charts and exportable reports
- [ ] Add automated deployment checks

## 📄 License

This project is maintained for the AITC Property Preservation & BPO Management System project.
