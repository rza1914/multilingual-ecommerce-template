# 🚀 Quick Start Guide

<div align="center">

![Time](https://img.shields.io/badge/setup_time-5_minutes-brightgreen.svg)
![Difficulty](https://img.shields.io/badge/difficulty-beginner-success.svg)
![Status](https://img.shields.io/badge/status-ready_to_use-blue.svg)

**Get Your E-Commerce Platform Running in 5 Minutes**

[📚 Full Documentation](COMPLETE_PROJECT_DOCUMENTATION.md) · [✅ Features](FEATURES_CHECKLIST.md) · [⚡ Quick Reference](QUICK_REFERENCE.md)

</div>

---

## ⏱️ 5-Minute Setup

### Prerequisites

Before starting, ensure you have:
- ✅ **Node.js** 18+ ([Download](https://nodejs.org))
- ✅ **Python** 3.10+ ([Download](https://python.org))
- ✅ **Git** ([Download](https://git-scm.com))

**Check your versions:**
```bash
node --version    # Should be v18.0.0 or higher
python --version  # Should be 3.10.0 or higher
git --version
```

---

## 🎯 Step-by-Step Setup

### Step 1: Clone Repository (30 seconds)

```bash
git clone https://github.com/rza1914/multilingual-ecommerce-template.git
cd multilingual-ecommerce-template
```

✅ **Success indicator:** You should see the project files

---

### Step 2: Backend Setup (2 minutes)

Open a new terminal and run:

#### For Windows:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python create_admin.py
uvicorn app.main:app --reload
```

#### For Mac/Linux:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python create_admin.py
uvicorn app.main:app --reload
```

✅ **Success indicator:** You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Keep this terminal open!**

---

### Step 3: Frontend Setup (2 minutes)

Open a **NEW** terminal and run:

```bash
cd frontend
npm install
npm run dev
```

✅ **Success indicator:** You should see:
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
```

**Keep this terminal open too!**

---

### Step 4: Access the Application (30 seconds)

Open your browser and visit:

#### 🌐 Frontend
**URL:** http://localhost:5173

**What you'll see:** Beautiful homepage with products

#### 🔧 Backend API Docs
**URL:** http://localhost:8000/docs

**What you'll see:** Interactive API documentation (Swagger UI)

---

## 🎉 You're All Set!

Your e-commerce platform is now running!

### What's Next?

1. **Login as Admin** to manage products and orders
2. **Browse Products** as a customer
3. **Test the Shopping Cart** and checkout
4. **Explore the Admin Dashboard**

---

## 🔑 Test Credentials

### 👨‍💼 Admin Account
```
Email: admin@example.com
Password: admin123
```
**Access:** Admin dashboard at http://localhost:5173/admin

### 👤 Regular User
```
Email: testuser@example.com
Password: test123
```
**Access:** Customer interface

### 📝 Or Register New Account
Click "Register" on the login page to create your own account!

---

## 🎯 Quick Tour

### For Customers

#### 1. Browse Products
- Visit http://localhost:5173
- Browse featured products
- Use search and filters
- Click on products for details

#### 2. Shopping Cart
- Click "Add to Cart" on any product
- View cart in the header (cart icon)
- Update quantities or remove items
- Proceed to checkout

#### 3. Checkout
- Fill in shipping address
- Review your order
- Place order
- View order confirmation

#### 4. Order History
- Click on your profile
- Go to "My Orders"
- Track order status
- View order details

---

### For Admins

#### 1. Admin Dashboard
**URL:** http://localhost:5173/admin
- View total revenue
- See order statistics
- Check product inventory
- Monitor user activity

#### 2. Manage Products
**URL:** http://localhost:5173/admin/products
- Add new products
- Edit existing products
- Update stock quantities
- Delete products

#### 3. Manage Orders
**URL:** http://localhost:5173/admin/orders
- View all orders
- Update order status:
  - Pending → Processing
  - Processing → Shipped
  - Shipped → Delivered
- Filter by status
- Search orders

---

## 📱 Visual Walkthrough

### Customer Experience

```
┌─────────────────────────────────────────┐
│          Homepage                       │
│  ┌─────────────────────────────────┐   │
│  │  🎨 Beautiful Hero Section      │   │
│  │  🛍️  Featured Products Grid     │   │
│  │  🔍 Search & Filter              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Product Details                   │
│  ┌─────────────────────────────────┐   │
│  │  📸 Product Image                │   │
│  │  📝 Description                  │   │
│  │  💰 Price & Stock Info           │   │
│  │  🛒 Add to Cart Button           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Shopping Cart                     │
│  ┌─────────────────────────────────┐   │
│  │  📦 Cart Items                   │   │
│  │  ➕➖ Quantity Controls           │   │
│  │  💵 Total Amount                 │   │
│  │  ✅ Proceed to Checkout          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Checkout                          │
│  ┌─────────────────────────────────┐   │
│  │  📍 Shipping Address             │   │
│  │  📋 Order Review                 │   │
│  │  💳 Payment (Ready to integrate) │   │
│  │  ✅ Place Order                  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

### Admin Experience

```
┌─────────────────────────────────────────┐
│       Admin Dashboard                   │
│  ┌──────────┬──────────┬──────────┐    │
│  │ 💰 Revenue│ 📦 Orders│ 👥 Users │    │
│  │  $15,000 │   125    │   350    │    │
│  └──────────┴──────────┴──────────┘    │
│  ┌─────────────────────────────────┐   │
│  │  📈 Revenue Chart                │   │
│  │  📋 Recent Orders                │   │
│  │  ⚠️  Low Stock Alerts            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Product Management                  │
│  ┌─────────────────────────────────┐   │
│  │  ➕ Add New Product              │   │
│  │  📋 Product List:                │   │
│  │    • Laptop - $999 - Stock: 50  │   │
│  │    • Phone - $699 - Stock: 100  │   │
│  │  ✏️  Edit | 🗑️ Delete            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Order Management                   │
│  ┌─────────────────────────────────┐   │
│  │  📋 All Orders List              │   │
│  │  🔍 Filter by Status             │   │
│  │  📊 Order #1234                  │   │
│  │     Status: Pending              │   │
│  │     [Update to Processing]       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🎨 Features to Try

### ✨ Customer Features

- [x] **Browse Products** - Beautiful product grid
- [x] **Search Products** - Real-time search
- [x] **Add to Cart** - Smooth cart experience
- [x] **Checkout** - Multi-step checkout flow
- [x] **Order History** - Track your orders
- [x] **Dark Mode** - Toggle in header
- [x] **Language Switch** - English/Persian

### 🔧 Admin Features

- [x] **Dashboard Analytics** - Revenue, orders, users
- [x] **Product Management** - CRUD operations
- [x] **Order Management** - Status updates
- [x] **Stock Management** - Inventory tracking
- [x] **Search & Filter** - Find anything fast

### 🔄 Legacy/Modern Toggle System

- [x] **Version Toggle** - Switch between legacy and modern UI
- [x] **Component Migration** - Seamlessly transition to new components
- [x] **Backward Compatibility** - Preserve existing functionality
- [x] **Feature Comparison** - Compare old vs new features
- [x] **User Preference** - Save toggle state per user

---

## 🛠️ Common Tasks

### Add Sample Products (Optional)

If you want more products to test with:

```bash
# In backend directory
python create_test_data.py
```

This will add 20+ sample products with different categories.

---

### Reset Database

To start fresh:

```bash
# In backend directory
rm ecommerce.db
python create_admin.py
```

---

### Change Ports

#### Backend (default: 8000)
```bash
uvicorn app.main:app --reload --port 8080
```

Then update frontend `.env`:
```bash
# frontend/.env
VITE_API_URL=http://localhost:8080
```

#### Frontend (default: 5173)
```bash
npm run dev -- --port 3000
```

---

## 🎓 Next Steps

### 1. Learn the Codebase

**Frontend Structure:**
```
frontend/src/
├── components/     # Reusable components
├── pages/         # Page components
├── contexts/      # State management
├── services/      # API calls
└── types/         # TypeScript types
```

**Backend Structure:**
```
backend/app/
├── api/v1/        # API endpoints
├── models/        # Database models
├── schemas/       # Data validation
└── core/          # Auth & config
```

### 2. Read Full Documentation

- **Complete Docs:** [COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md)
- **Features List:** [FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md)
- **Quick Commands:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### 3. Try Development

**Add a new product category:**
1. Open admin panel
2. Click "Add Product"
3. Choose a new category
4. Fill in details and save

**Modify a component:**
1. Open `frontend/src/components/products/ProductCard.tsx`
2. Change the styling
3. See it update instantly (hot reload)

### 4. Deploy to Production

**Frontend:** Deploy to Vercel
- Push to GitHub
- Connect to Vercel
- Auto-deploy on push

**Backend:** Deploy to Render
- Connect GitHub repository
- Add environment variables
- Deploy with one click

[Full deployment guide](COMPLETE_PROJECT_DOCUMENTATION.md#-deployment-guide)

---

## ❓ Troubleshooting

### Backend won't start?

**Check 1:** Is port 8000 free?
```bash
# Kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

**Check 2:** Is virtual environment activated?
```bash
# You should see (venv) in your terminal
# If not, activate it:
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

---

### Frontend won't start?

**Check 1:** Did npm install complete?
```bash
# Try again
rm -rf node_modules package-lock.json
npm install
```

**Check 2:** Is Node.js version correct?
```bash
node --version
# Should be 18.0.0 or higher
# Update if needed: https://nodejs.org
```

---

### Can't login?

**Check 1:** Is backend running?
- Visit http://localhost:8000/docs
- Should show API documentation

**Check 2:** Using correct credentials?
```
Admin: admin@example.com / admin123
User: testuser@example.com / test123
```

**Check 3:** Recreate admin user
```bash
cd backend
python create_admin.py
```

---

### Changes not showing?

**Frontend:**
- Hard refresh browser: `Ctrl+Shift+R`
- Clear cache: `Ctrl+Shift+Delete`
- Restart dev server

**Backend:**
- Check terminal for errors
- Restart with `Ctrl+C` and `uvicorn app.main:app --reload`

---

## 📞 Get Help

### Can't solve it?

1. **Check Quick Reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. **Check Full Docs:** [COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md)
3. **Search Issues:** [GitHub Issues](https://github.com/rza1914/multilingual-ecommerce-template/issues)
4. **Ask Question:** [GitHub Discussions](https://github.com/rza1914/multilingual-ecommerce-template/discussions)

---

## ✅ Setup Checklist

After setup, verify everything works:

- [ ] ✅ Backend runs at http://localhost:8000
- [ ] ✅ Frontend runs at http://localhost:5173
- [ ] ✅ Can view API docs at http://localhost:8000/docs
- [ ] ✅ Can login as admin
- [ ] ✅ Can browse products
- [ ] ✅ Can add products to cart
- [ ] ✅ Can access admin dashboard
- [ ] ✅ Dark mode toggle works
- [ ] ✅ Language switch works

**All checked?** 🎉 You're ready to develop!

---

## 🎬 Video Tutorial

> **Coming Soon:** Watch a 3-minute video setup tutorial

In the meantime, this guide covers everything you need!

---

## 📊 What You've Achieved

After completing this quick start, you have:

✅ A fully functional e-commerce platform
✅ Admin panel with analytics
✅ Customer shopping experience
✅ Product management system
✅ Order management system
✅ Authentication system
✅ Responsive design
✅ Dark mode
✅ Bilingual support

**Time spent:** ~5 minutes
**Lines of code running:** ~8,500
**Features available:** 59+

---

## 🚀 Ready to Build?

Now that you're up and running:

1. **Explore** the features
2. **Test** the functionality
3. **Read** the full documentation
4. **Customize** to your needs
5. **Deploy** to production
6. **Share** with others

---

<div align="center">

### 🎉 Happy Coding! 🎉

**You're now running a production-ready e-commerce platform!**

[📚 Full Docs](COMPLETE_PROJECT_DOCUMENTATION.md) · [⚡ Quick Reference](QUICK_REFERENCE.md) · [✅ Features](FEATURES_CHECKLIST.md)

---

**Questions?** Check the [Troubleshooting](#-troubleshooting) section above

**Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md)

**Found a bug?** [Report it](https://github.com/rza1914/multilingual-ecommerce-template/issues)

---

Made with ❤️ for developers

[⬆ Back to Top](#-quick-start-guide)

</div>
