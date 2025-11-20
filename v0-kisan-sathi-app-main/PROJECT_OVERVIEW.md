# Kisan Sathi - Project Overview

## 📋 Table of Contents
1. [Project Summary](#project-summary)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Documentation](#documentation)

## Project Summary

**Kisan Sathi** is a comprehensive smart farming platform designed to empower farmers with modern technology. It combines farm management, AI-powered analysis tools, marketplace functionality, and expert guidance in a single integrated platform.

### Vision
To make advanced agricultural technology accessible to every farmer, improving productivity and profitability through data-driven insights.

### Target Users
- Small and medium-scale farmers
- Agricultural buyers and sellers
- Farm managers
- Agricultural consultants

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │Dashboard │  │Farm Mgmt │  │Marketplace│  │AI Tools ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└────────────────────────┬────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────┴────────────────────────────────┐
│                   Backend (Django)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │Farm API  │  │Market API│  │Soil API  │  │Chat API ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│              Database (PostgreSQL/SQLite)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │Farm Data │  │Products  │  │Users     │  │Analysis ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Request** → Frontend (Next.js)
2. **API Call** → Backend (Django REST Framework)
3. **Business Logic** → Django Views/Serializers
4. **Data Access** → Database (PostgreSQL)
5. **Response** → JSON → Frontend → User Interface

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Programming language |
| Django | 5.2.8 | Web framework |
| Django REST Framework | 3.14+ | API development |
| PostgreSQL | 13+ | Production database |
| SQLite | 3.x | Development database |
| Groq AI | Latest | AI analysis |
| ReportLab | 4.0+ | PDF generation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0 | React framework |
| React | 19 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | UI components |
| Chart.js | 4.x | Data visualization |

### DevOps
- Git for version control
- GitHub for repository hosting
- Vercel for frontend deployment (optional)
- Gunicorn for production server
- Nginx for reverse proxy

## Features

### 1. Farm Management System
**Purpose**: Complete farm operations management

**Modules**:
- Income tracking with categories
- Expense management
- Inventory control (seeds, fertilizers, equipment)
- Crop planning and monitoring
- Livestock management
- Loan and EMI tracking
- Analytics dashboard with charts

**Key Benefits**:
- Real-time financial insights
- Inventory alerts
- Crop cycle tracking
- Profitability analysis

### 2. AI Soil Analyzer
**Purpose**: Intelligent soil health assessment

**Features**:
- Multi-parameter analysis (N, P, K, pH, etc.)
- AI-powered recommendations
- PDF report generation
- Voice output in multiple languages
- Historical tracking

**Technology**: Groq AI API for analysis

### 3. AI Crop Doctor
**Purpose**: Disease detection and treatment

**Features**:
- Image-based disease identification
- Treatment recommendations
- Severity assessment
- Prevention guidelines

**Technology**: AI image recognition

### 4. Marketplace
**Purpose**: Agricultural product trading platform

**Features**:
- Product listings with images
- Shopping cart
- Order management
- Buyer and seller dashboards
- Search and filters
- Wishlist

**User Types**: Farmers (sellers) and Buyers

### 5. Expert Chatbot
**Purpose**: 24/7 farming advice

**Features**:
- Natural language conversations
- Multi-language support (8+ languages)
- Voice input/output
- Context-aware responses
- Farming expertise

**Technology**: Groq AI with custom prompts

### 6. Government Schemes
**Purpose**: Access to agricultural schemes

**Features**:
- Browse schemes by category
- State-wise filtering
- Detailed information
- Eligibility criteria
- Application links

### 7. Weather Integration
**Purpose**: Weather information for farming

**Features**:
- Current conditions
- 7-day forecast
- Location-based data
- Agricultural alerts

## Project Structure

```
kisan-sathi/
│
├── kisan_sathi_backend/          # Django Backend
│   ├── kisan_sathi/              # Project settings
│   │   ├── settings.py           # Configuration
│   │   ├── urls.py               # Main URL routing
│   │   └── wsgi.py               # WSGI config
│   │
│   ├── farmers/                  # User management
│   │   ├── models.py             # User models
│   │   ├── views.py              # Auth views
│   │   └── serializers.py        # User serializers
│   │
│   ├── farm_management/          # Farm operations
│   │   ├── models.py             # Farm data models
│   │   ├── views.py              # Farm API views
│   │   ├── serializers.py        # Data serializers
│   │   └── templates/            # Django templates
│   │
│   ├── marketplace/              # Product marketplace
│   │   ├── models.py             # Product models
│   │   ├── views.py              # Marketplace API
│   │   └── serializers.py        # Product serializers
│   │
│   ├── soil_analysis/            # AI Soil Analyzer
│   │   ├── models.py             # Analysis models
│   │   ├── ai_engine.py          # AI logic
│   │   ├── pdf_generator.py     # PDF reports
│   │   └── voice_generator.py   # Voice output
│   │
│   ├── chatbot/                  # Expert chatbot
│   │   ├── models.py             # Chat models
│   │   ├── views.py              # Chat API
│   │   └── expert_system_prompt.py
│   │
│   ├── schemes/                  # Government schemes
│   │   ├── models.py             # Scheme models
│   │   └── views.py              # Scheme API
│   │
│   ├── manage.py                 # Django CLI
│   └── requirements.txt          # Python dependencies
│
├── v0-kisan-sathi-app/           # Next.js Frontend
│   ├── app/                      # App router
│   │   ├── page.tsx              # Home page
│   │   ├── dashboard/            # Dashboard
│   │   ├── farm-management/      # Farm pages
│   │   ├── marketplace/          # Market pages
│   │   ├── soil-analysis/        # Soil analyzer
│   │   ├── crop-doctor/          # Crop doctor
│   │   ├── chatbot/              # Chatbot
│   │   └── weather/              # Weather
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # UI components
│   │   ├── farm-management/      # Farm components
│   │   ├── auth-context.tsx      # Auth provider
│   │   └── theme-toggle.tsx      # Dark mode
│   │
│   ├── lib/                      # Utilities
│   │   ├── farm-api.ts           # Farm API calls
│   │   ├── marketplace-api.ts    # Market API calls
│   │   └── soil-api.ts           # Soil API calls
│   │
│   ├── public/                   # Static assets
│   ├── package.json              # Dependencies
│   └── next.config.js            # Next.js config
│
└── docs/                         # Documentation
    ├── README.md                 # Main readme
    ├── QUICK_START.md            # Quick start
    ├── DEPLOYMENT.md             # Deployment
    ├── API_REFERENCE.md          # API docs
    ├── MODULES.md                # Module docs
    └── TROUBLESHOOTING.md        # Troubleshooting
```

## Getting Started

### Quick Start (5 minutes)

1. **Clone repository**
2. **Setup backend** (2 min)
   - Create virtual environment
   - Install dependencies
   - Run migrations
   - Start server

3. **Setup frontend** (2 min)
   - Install dependencies
   - Start dev server

4. **Access application** (1 min)
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Project introduction |
| [QUICK_START.md](./QUICK_START.md) | Get started in 5 minutes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API documentation |
| [MODULES.md](./MODULES.md) | Module-specific guides |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues & solutions |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| [SECURITY.md](./SECURITY.md) | Security policy |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

## Development Roadmap

### Phase 1: Core Features ✅ (Completed)
- Farm management system
- User authentication
- Basic marketplace
- Dashboard

### Phase 2: AI Integration ✅ (Completed)
- AI Soil Analyzer
- AI Crop Doctor
- Expert Chatbot

### Phase 3: Enhancement 🔄 (In Progress)
- Mobile app (React Native)
- Advanced analytics
- IoT sensor integration
- Offline mode

### Phase 4: Scale 📋 (Planned)
- Multi-tenant support
- Enterprise features
- API marketplace
- Third-party integrations

## Team

- **Backend Development**: Django REST Framework
- **Frontend Development**: Next.js + TypeScript
- **AI Integration**: Groq AI API
- **UI/UX Design**: Tailwind CSS + shadcn/ui
- **DevOps**: Docker + Nginx + PostgreSQL

## License

MIT License - See [LICENSE](./LICENSE) for details

## Support

- **Email**: support@kisansathi.com
- **Documentation**: See docs/ folder
- **Issues**: GitHub Issues
- **Community**: Discord/Slack

---

**Built with ❤️ for farmers**

*Last Updated: November 20, 2025*
