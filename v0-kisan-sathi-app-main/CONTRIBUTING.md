# Contributing to Kisan Sathi

Thank you for your interest in contributing to Kisan Sathi! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check if the feature has been suggested
2. Describe the feature clearly
3. Explain the use case
4. Provide examples if possible

### Code Contributions

#### Setup Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/kisan-sathi.git
cd kisan-sathi
```

3. Create a branch:
```bash
git checkout -b feature/your-feature-name
```

4. Setup backend:
```bash
cd kisan_sathi_backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
```

5. Setup frontend:
```bash
cd v0-kisan-sathi-app
npm install
```

#### Coding Standards

**Python (Django):**
- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions
- Write unit tests for new features

```python
def calculate_profit(income: float, expenses: float) -> float:
    """
    Calculate net profit from income and expenses.
    
    Args:
        income: Total income amount
        expenses: Total expenses amount
        
    Returns:
        Net profit (income - expenses)
    """
    return income - expenses
```

**TypeScript/React:**
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Add prop types

```typescript
interface FarmCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export function FarmCard({ title, value, icon }: FarmCardProps) {
  return (
    <div className="card">
      {icon}
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
```

#### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add crop disease detection feature
fix: Resolve authentication token expiry issue
docs: Update API documentation
style: Format code according to PEP 8
refactor: Simplify farm management logic
test: Add tests for marketplace module
```

#### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass:
```bash
# Backend
python manage.py test

# Frontend
npm run test
```

4. Update CHANGELOG.md
5. Create pull request with:
   - Clear title
   - Description of changes
   - Related issue numbers
   - Screenshots (if UI changes)

6. Wait for review
7. Address feedback
8. Merge after approval

### Testing

#### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test farm_management

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

#### Frontend Tests

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Documentation

- Update README.md for major changes
- Add API documentation for new endpoints
- Include code comments for complex logic
- Update module documentation

## Project Structure

```
kisan-sathi/
├── kisan_sathi_backend/
│   ├── farm_management/      # Farm operations
│   ├── marketplace/           # Product marketplace
│   ├── soil_analysis/         # AI soil analyzer
│   ├── chatbot/              # Expert chatbot
│   ├── farmers/              # User management
│   └── schemes/              # Government schemes
├── v0-kisan-sathi-app/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   └── public/               # Static assets
└── docs/                     # Documentation
```

## Development Workflow

1. **Pick an issue** from GitHub Issues
2. **Create a branch** from `main`
3. **Make changes** following coding standards
4. **Test thoroughly** locally
5. **Commit changes** with clear messages
6. **Push to your fork**
7. **Create pull request**
8. **Respond to feedback**
9. **Merge after approval**

## Adding New Features

### Backend (Django)

1. Create new app if needed:
```bash
python manage.py startapp new_feature
```

2. Add to INSTALLED_APPS in settings.py

3. Create models:
```python
from django.db import models

class NewModel(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
```

4. Create migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create serializers, views, URLs

6. Write tests

### Frontend (Next.js)

1. Create new page in `app/` directory

2. Create components in `components/`

3. Add API calls in `lib/`

4. Update navigation

5. Add tests

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful
- Explain reasoning for changes
- Approve when ready
- Test changes locally if possible

### For Contributors

- Respond to feedback promptly
- Ask questions if unclear
- Make requested changes
- Thank reviewers

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Tag release
7. Deploy to production

## Getting Help

- **Discord**: Join our community
- **Email**: dev@kisansathi.com
- **Documentation**: Check docs/ folder
- **Issues**: Ask questions on GitHub

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Kisan Sathi! 🌾
