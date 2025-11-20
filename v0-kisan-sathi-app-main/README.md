# Kisan Sathi - Smart Farming Platform

A comprehensive agricultural management platform built with Django and Next.js, designed to empower farmers with modern technology.

## 🌾 Overview

Kisan Sathi is an all-in-one farming solution that provides:
- **Farm Management** - Track income, expenses, inventory, crops, and livestock
- **AI Soil Analyzer** - Get intelligent soil analysis and recommendations
- **AI Crop Doctor** - Diagnose crop diseases using image recognition
- **Marketplace** - Buy and sell agricultural products
- **Expert Chatbot** - Get farming advice in multiple languages
- **Weather Integration** - Real-time weather updates
- **Government Schemes** - Access to agricultural schemes and subsidies

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip and npm

### Installation

1. **Clone the repository**
```bash
cd v0-kisan-sathi-app-main
```

2. **Backend Setup (Django)**
```bash
cd kisan_sathi_backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Frontend Setup (Next.js)**
```bash
cd v0-kisan-sathi-app
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **Farm Management**: http://localhost:8000/farm-management/dashboard/

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get up and running quickly
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [API Documentation](./API_REFERENCE.md) - Complete API reference
- [Module Guides](./MODULES.md) - Detailed module documentation
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

## 🛠️ Technology Stack

**Backend:**
- Django 5.2.8
- Django REST Framework
- PostgreSQL/SQLite
- Groq AI API

**Frontend:**
- Next.js 16.0
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## 📦 Project Structure

```
kisan-sathi/
├── kisan_sathi_backend/     # Django backend
│   ├── farm_management/     # Farm management module
│   ├── marketplace/         # Marketplace module
│   ├── soil_analysis/       # AI Soil Analyzer
│   ├── chatbot/            # Expert chatbot
│   ├── farmers/            # User management
│   └── schemes/            # Government schemes
├── v0-kisan-sathi-app/     # Next.js frontend
│   ├── app/                # App routes
│   ├── components/         # React components
│   └── lib/                # Utilities
└── docs/                   # Documentation
```

## 🌟 Features

### Farm Management
- Income & expense tracking
- Inventory management
- Crop planning & monitoring
- Livestock management
- Loan & EMI tracking
- Analytics & reports

### AI Features
- Soil analysis with recommendations
- Crop disease detection
- Multi-language chatbot support
- Voice input/output

### Marketplace
- Product listings
- Cart & checkout
- Order management
- Buyer & seller dashboards

## 👥 User Roles

- **Farmers** - Manage farms, access AI tools, buy/sell products
- **Buyers** - Purchase agricultural products
- **Admins** - System administration and oversight

## 🔐 Environment Variables

Create `.env` files in both backend and frontend:

**Backend (.env)**
```
SECRET_KEY=your-secret-key
DEBUG=True
GROQ_API_KEY=your-groq-api-key
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📧 Support

For support, email support@kisansathi.com or open an issue on GitHub.

---

Built with ❤️ for farmers
