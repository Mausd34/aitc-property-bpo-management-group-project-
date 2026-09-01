# American IT Centre Property Preservation & BPO Management System

## Stack
- Python / Django / Django REST Framework
- React + Vite
- PostgreSQL (SQLite fallback for easy testing)

## Run backend
```bash
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Backend: http://127.0.0.1:8000/  | Admin: http://127.0.0.1:8000/admin/ | API: http://127.0.0.1:8000/api/

For PostgreSQL set DB_NAME, DB_USER, DB_PASSWORD, DB_HOST and DB_PORT environment variables. If DB_NAME is not set, SQLite is used.

## Run frontend
```bash
MAsud

```
Frontend: http://localhost:5173/

## Demo data
After migrations:
```bash
python manage.py seed_demo
```

## Modules
Users, Clients, Properties, Work Orders, Vendors, Dispatch/Assignment, QA Review, Documents, Notifications, Reports and Dashboard.
