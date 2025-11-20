# 🚀 Run Servers in Your Terminal

## Option 1: Run Django Backend (Marketplace)

Open a terminal and run:

```bash
cd v0-kisan-sathi-app-main\kisan_sathi_backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Access**: http://127.0.0.1:8000/marketplace/

---

## Option 2: Run Next.js Frontend

Open a **separate terminal** and run:

```bash
cd v0-kisan-sathi-app-main\v0-kisan-sathi-app
npm run dev
```

**Access**: http://localhost:3000/

---

## Option 3: Run Both (Recommended)

### Terminal 1 - Django Backend:
```bash
cd v0-kisan-sathi-app-main\kisan_sathi_backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 - Next.js Frontend:
```bash
cd v0-kisan-sathi-app-main\v0-kisan-sathi-app
npm run dev
```

---

## 🎯 Quick Access URLs

### Django Marketplace (100% Complete)
- **Homepage**: http://127.0.0.1:8000/marketplace/
- **Products**: http://127.0.0.1:8000/marketplace/products/
- **Cart**: http://127.0.0.1:8000/marketplace/cart/
- **Admin**: http://127.0.0.1:8000/admin/

### Next.js Frontend
- **Homepage**: http://localhost:3000/
- **Farm Management**: http://localhost:3000/farm-management/
- **Weather**: http://localhost:3000/weather/
- **Chatbot**: http://localhost:3000/chatbot/

---

## 💡 Tips

1. **Keep terminals open** - Don't close them while using the app
2. **Stop servers** - Press `Ctrl+C` in the terminal
3. **Restart** - Just run the commands again
4. **Check ports** - Make sure ports 8000 and 3000 are free

---

## 🔥 Recommended Start

**For Marketplace Testing:**
1. Open terminal
2. Run Django backend commands above
3. Visit: http://127.0.0.1:8000/marketplace/

**For Full App:**
1. Open 2 terminals
2. Run both Django and Next.js
3. Visit both URLs

---

## ✅ You're Ready!

Just copy and paste the commands into your terminal and you'll be able to access the marketplace!
