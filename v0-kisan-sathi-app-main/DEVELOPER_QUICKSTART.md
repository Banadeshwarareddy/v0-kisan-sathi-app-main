# 👨‍💻 Kisan Sathi - Developer Quick Start

## 🚀 Get Started in 5 Minutes

This guide will get you up and running with Kisan Sathi development environment.

---

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- Git
- Code editor (VS Code recommended)

---

## ⚡ Quick Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd kisan-sathi-app-main
```

### 2. Backend Setup (Django)

```bash
# Navigate to backend
cd kisan_sathi_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend will run at: **http://localhost:8000**

### 3. Frontend Setup (Next.js)

```bash
# Open new terminal
cd v0-kisan-sathi-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## 🎯 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Register new user |
| Backend API | http://localhost:8000/api/ | - |
| Django Admin | http://localhost:8000/admin/ | Superuser created above |

---

## 📁 Project Structure

```
kisan-sathi-app-main/
├── kisan_sathi_backend/          # Django Backend
│   ├── farmers/                   # User management
│   ├── farm_management/           # Farm operations
│   ├── marketplace/               # E-commerce
│   ├── soil_analysis/             # AI Soil Analyzer
│   ├── weather/                   # Weather data
│   ├── chatbot/                   # AI Chatbot
│   ├── mandi/                     # Market prices
│   ├── schemes/                   # Govt schemes
│   ├── crop_doctor/               # Disease diagnosis
│   └── kisan_sathi/               # Main settings
│
└── v0-kisan-sathi-app/            # Next.js Frontend
    ├── app/                       # App router pages
    ├── components/                # React components
    ├── lib/                       # Utilities & API
    └── hooks/                     # Custom hooks
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite by default)
DATABASE_URL=sqlite:///db.sqlite3

# API Keys
GROQ_API_KEY=your-groq-api-key
WEATHER_API_KEY=your-weather-api-key

# Email (optional for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
```

---

## 🧪 Testing the Setup

### 1. Test Backend

```bash
# In backend directory
python manage.py test

# Or test specific app
python manage.py test farmers
```

### 2. Test Frontend

```bash
# In frontend directory
npm run build
npm start
```

### 3. Test API

Visit: http://localhost:8000/api/

You should see the API root with available endpoints.

---

## 📚 Key Commands

### Backend Commands

```bash
# Create new app
python manage.py startapp app_name

# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run development server
python manage.py runserver

# Django shell
python manage.py shell
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## 🔧 Common Development Tasks

### Adding a New Feature

1. **Backend**:
   ```bash
   # Create new app
   python manage.py startapp feature_name
   
   # Add to INSTALLED_APPS in settings.py
   # Create models, views, serializers
   # Add URLs
   # Run migrations
   ```

2. **Frontend**:
   ```bash
   # Create new page in app/
   # Create components in components/
   # Add API calls in lib/
   # Update navigation
   ```

### Database Operations

```bash
# Reset database
python manage.py flush

# Load fixtures
python manage.py loaddata fixture_name

# Dump data
python manage.py dumpdata app_name > fixture.json

# Database shell
python manage.py dbshell
```

### Debugging

```python
# Add breakpoint in Python code
import pdb; pdb.set_trace()

# Or use Django debug toolbar
# Add to INSTALLED_APPS: 'debug_toolbar'
```

```typescript
// Add breakpoint in TypeScript
debugger;

// Or use console
console.log('Debug:', variable);
```

---

## 📖 Module Overview

### 1. Authentication (farmers/)
- User registration & login
- JWT authentication
- Profile management

### 2. Farm Management (farm_management/)
- Dashboard, Income, Expenses
- Crops, Inventory, Livestock, Loans

### 3. Marketplace (marketplace/)
- Product listings
- Cart & Checkout
- Order management

### 4. Soil Analyzer (soil_analysis/)
- AI-powered analysis
- PDF/Audio reports
- Historical tracking

### 5. Weather (weather/)
- Current weather
- Forecasts
- Advisories

### 6. Chatbot (chatbot/)
- AI conversations
- Voice support
- Multi-language

### 7. Mandi Prices (mandi/)
- Real-time prices
- Market trends

### 8. Schemes (schemes/)
- Government schemes
- Eligibility checker

### 9. Crop Doctor (crop_doctor/)
- Disease diagnosis
- Treatment recommendations

### 10. Admin (farmers/admin_views.py)
- User management
- Analytics

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Module not found
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Problem**: Database errors
```bash
# Solution: Reset migrations
python manage.py migrate --run-syncdb
```

**Problem**: Port already in use
```bash
# Solution: Use different port
python manage.py runserver 8001
```

### Frontend Issues

**Problem**: Module not found
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Build errors
```bash
# Solution: Clear cache
rm -rf .next
npm run build
```

**Problem**: API connection failed
```bash
# Solution: Check NEXT_PUBLIC_API_URL in .env.local
```

---

## 📝 Code Style

### Python (Backend)

```python
# Follow PEP 8
# Use type hints
def function_name(param: str) -> dict:
    """Docstring explaining function."""
    return {"key": "value"}

# Use meaningful names
# Add comments for complex logic
```

### TypeScript (Frontend)

```typescript
// Use TypeScript types
interface User {
  id: number;
  name: string;
}

// Use arrow functions
const Component = () => {
  return <div>Content</div>;
};

// Use meaningful names
// Add JSDoc comments
```

---

## 🔗 Useful Links

### Documentation:
- Django: https://docs.djangoproject.com/
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/

### Tools:
- VS Code: https://code.visualstudio.com/
- Postman: https://www.postman.com/
- Git: https://git-scm.com/

---

## 🎓 Learning Resources

### For Backend:
- Django REST Framework tutorial
- Python best practices
- Database design patterns

### For Frontend:
- Next.js App Router guide
- React Hooks documentation
- TypeScript handbook

---

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit pull request
5. Wait for review

---

## 📞 Getting Help

### Resources:
- Project documentation
- Code comments
- Team chat
- Stack Overflow

### Common Questions:
- Check existing issues
- Search documentation
- Ask in team chat

---

## ✅ Development Checklist

Before starting development:
- [ ] Repository cloned
- [ ] Backend running
- [ ] Frontend running
- [ ] Database migrated
- [ ] Superuser created
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Code editor configured

---

## 🎉 You're Ready!

You now have a fully functional development environment for Kisan Sathi!

**Next Steps:**
1. Explore the codebase
2. Try making small changes
3. Test your changes
4. Read module documentation
5. Start building features!

**Happy Coding! 🚀**

---

*For detailed information, check PROJECT_SUMMARY.md and other documentation files.*
