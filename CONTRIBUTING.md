# Contributing to AITC Property Preservation & BPO Management System

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct
- Be respectful and professional in all interactions
- Welcome diverse perspectives and experiences
- Focus on constructive feedback
- Report any violations to the project maintainers

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git
- PostgreSQL (optional, SQLite works for development)

### Development Environment Setup

#### 1. Clone and Install Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Unix
pip install -r requirements.txt
```

#### 2. Configure Database
**SQLite (default for testing):**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

**PostgreSQL (production):**
Set environment variables:
```bash
DB_NAME=your_db_name
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

Then run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

#### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### 4. Load Demo Data (optional)
```bash
cd backend
python manage.py seed_demo
```

## Development Workflow

### Branch Naming Conventions
- **Feature**: `feature/description` - New features
- **Bug fix**: `bugfix/description` - Bug fixes
- **Improvement**: `improvement/description` - Code improvements
- **Documentation**: `docs/description` - Documentation updates

Example: `feature/add-work-order-tracking`

### Commit Message Guidelines
Follow this format:
```
[TYPE] Brief summary (50 chars max)

Optional detailed description explaining the why and what.
- Keep lines under 72 characters
- Reference issues/PRs: Fixes #123, Related to #456
- Use imperative mood: "Add feature" not "Added feature"
```

**Commit Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

Example:
```
feat: Add property image upload functionality

- Implement image upload endpoint
- Add image model and serializer
- Create image management in property details
- Include image size validation

Fixes #42
```

## Modules Overview

The system consists of the following modules:
- **Users** - User management and authentication
- **Clients** - Client information and management
- **Properties** - Property listings and details
- **Work Orders** - Task and job tracking
- **Vendors** - Vendor/contractor management
- **Dispatch/Assignment** - Work assignment system
- **QA Review** - Quality assurance processes
- **Documents** - Document storage and management
- **Notifications** - User notifications
- **Reports** - Reporting and analytics
- **Dashboard** - System overview and metrics

## Making Changes

### Backend Development

#### Structure
```
backend/
├── config/          # Django settings, URLs, WSGI
├── core/           # Main app with models, views, serializers
│   ├── models.py   # Database models
│   ├── views.py    # API endpoints
│   ├── serializers.py  # DRF serializers
│   └── urls.py     # API routes
└── manage.py       # Django management
```

#### Code Standards
- Follow PEP 8 style guide
- Use type hints where applicable
- Keep functions focused and under 50 lines
- Add docstrings to functions and classes
- Use Django ORM for database queries

#### Running Backend
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
API available at: `http://127.0.0.1:8000/api/`

### Frontend Development

#### Structure
```
frontend/
├── src/
│   ├── main.jsx    # Entry point
│   ├── style.css   # Global styles
│   └── components/ # React components (suggested)
├── index.html      # HTML template
├── package.json    # Dependencies
└── vite.config.js  # Vite configuration
```

#### Code Standards
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful variable and component names
- Add comments for complex logic
- Follow React best practices

#### Running Frontend
```bash
cd frontend
npm run dev
```
Frontend available at: `http://localhost:5173/`

## Testing

### Backend Tests
```bash
cd backend
venv\Scripts\activate
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

**Guidelines:**
- Write tests for new features
- Update tests when modifying existing functionality
- Aim for 70%+ code coverage
- Test edge cases and error scenarios

## Pull Request Process

### Before Creating a PR
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit with clear messages
3. Test locally (both backend and frontend)
4. Ensure no console errors or warnings
5. Update documentation if needed

### Creating a PR
1. Push your branch: `git push origin feature/your-feature`
2. Create a pull request with a clear title and description
3. Link related issues: `Fixes #123`
4. Include screenshots/GIFs for UI changes
5. Provide testing instructions

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
Steps to test the changes:
1. ...
2. ...

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### PR Review Guidelines
- Respond to feedback promptly
- Make requested changes in new commits
- Re-request review after updates
- Keep PRs focused on single feature/fix

## Documentation

### When to Update Docs
- Adding new features or modules
- Changing API endpoints or responses
- Modifying setup/installation process
- Adding significant functionality

### Documentation Files
- `README.md` - Project overview and setup
- Module-specific `.md` files (e.g., `CLIENTS_MODULE_COMPLETE.md`)
- Inline code comments for complex logic
- API documentation in docstrings

## Reporting Issues

### Before Reporting
- Check existing issues to avoid duplicates
- Reproduce the issue consistently
- Gather relevant information

### Issue Template
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/Mac/Linux
- Browser: (if frontend issue)
- Python version: 3.8+
- Node version: 14+

## Screenshots/Logs
[Attach any relevant files]
```

## Performance Considerations

### Backend
- Use database indexing for frequently queried fields
- Implement pagination for large datasets
- Use select_related and prefetch_related for queries
- Cache frequently accessed data

### Frontend
- Lazy load components when possible
- Optimize images and assets
- Use React.memo for expensive components
- Minimize bundle size

## Database Migrations

### Creating Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Guidelines
- Create migrations for model changes
- Write descriptive migration names
- Test migrations on test database first
- Never modify past migrations in production

## Version Control

### Typical Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push and create PR
git push origin feature/new-feature

# After PR approval, merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
```

## Getting Help

- Check existing documentation in the repo
- Review similar completed features
- Ask questions in PR comments
- Contact project maintainers

## Recognition

Contributors will be recognized in:
- Git commit history
- Pull request list
- Project documentation (when applicable)

---

Thank you for contributing to make AITC Property Preservation & BPO Management System better!
