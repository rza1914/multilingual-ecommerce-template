# 🛍️ Multilingual E-Commerce Template

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178c6.svg)

A full-stack e-commerce platform with admin panel, built with React, TypeScript, FastAPI, and SQLAlchemy.

[Demo](#) · [Features](#features) · [Installation](#installation) · [Documentation](#documentation)

</div>

---

## ✨ Features

### 🛒 **Customer Features**
- 🔐 User Authentication (Register/Login/Logout)
- 📦 Product Catalog with Search & Filters
- 🛍️ Shopping Cart (Add/Update/Remove)
- 💳 Multi-Step Checkout Process
- 📋 Order History & Tracking
- 👤 User Profile Management
- 🌙 Dark Mode Support
- 📱 Fully Responsive Design
- 🌍 Bilingual Support (English/Persian)

### 👨‍💼 **Admin Features**
- 📊 Dashboard with Statistics & Analytics
- 📦 Product Management (Create/Edit/Delete)
- 📋 Order Management (View/Update Status)
- 📈 Revenue Charts & Reports
- 🔍 Advanced Search & Filters
- 👥 User Overview

### 🎨 **Design & UX**
- ✨ Liquid Glass Morphism Design
- 🍊 iPhone 17 Orange Theme
- 🌓 Complete Dark Mode
- 📱 Mobile-First Responsive
- ⚡ Smooth Animations & Transitions
- 🎭 Professional UI Components

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React 18.3.1** - UI Library
- 📘 **TypeScript 5.6.2** - Type Safety
- 🎨 **Tailwind CSS 3.4.14** - Styling
- 🧭 **React Router DOM 6.28.0** - Routing
- 🎭 **Lucide React** - Icons
- ⚡ **Vite 5.4.10** - Build Tool

### **Backend**
- 🐍 **Python** - Programming Language
- ⚡ **FastAPI** - Web Framework
- 🗄️ **SQLAlchemy** - ORM
- 💾 **SQLite** - Database (Development)
- 🔐 **JWT** - Authentication
- 🔒 **Bcrypt** - Password Hashing

---

## 📸 Screenshots

### Customer Interface
![Homepage](docs/screenshots/homepage.png)
*Modern homepage with featured products*

![Product Catalog](docs/screenshots/products.png)
*Product listing with search and filters*

![Shopping Cart](docs/screenshots/cart.png)
*Interactive shopping cart*

![Checkout](docs/screenshots/checkout.png)
*Multi-step checkout process*

### Admin Panel
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
*Admin dashboard with analytics*

![Product Management](docs/screenshots/admin-products.png)
*Product management interface*

![Order Management](docs/screenshots/admin-orders.png)
*Order management with status updates*

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Clone Repository
```bash
git clone https://github.com/rza1914/multilingual-ecommerce-template.git
cd multilingual-ecommerce-template
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create admin user
python create_admin.py

# Create test data (optional)
python create_test_data.py

# Run backend server
uvicorn app.main:app --reload
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔑 Test Credentials

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### User Accounts
```
Email: testuser@example.com
Password: test123

Email: john@example.com
Password: john123
```

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

#### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/search` - Search products

#### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/{id}` - Get order details
- `PUT /api/v1/orders/{id}/cancel` - Cancel order

#### Admin (Requires Admin Role)
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/products` - Manage products
- `GET /api/v1/admin/orders` - Manage orders
- `PUT /api/v1/admin/orders/{id}/status` - Update order status

---

## 📁 Project Structure

```
multilingual-ecommerce-template/
├── 📂 backend/
│   ├── 📂 app/
│   │   ├── 📂 api/v1/        # API endpoints
│   │   ├── 📂 models/        # Database models
│   │   ├── 📂 schemas/       # Pydantic schemas
│   │   ├── database.py       # Database config
│   │   ├── utils.py          # Utilities
│   │   └── main.py           # FastAPI app
│   ├── create_admin.py       # Admin creation script
│   ├── create_test_data.py   # Test data script
│   └── requirements.txt      # Python dependencies
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/    # React components
│   │   ├── 📂 pages/         # Page components
│   │   ├── 📂 contexts/      # React contexts
│   │   ├── 📂 services/      # API services
│   │   ├── App.tsx           # Main app
│   │   └── main.tsx          # Entry point
│   └── package.json          # Node dependencies
│
└── README.md                 # This file
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` files for configuration (optional):

#### Backend `.env`
```env
DATABASE_URL=sqlite:///./ecommerce.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)
1. Update `DATABASE_URL` to PostgreSQL
2. Set environment variables
3. Deploy using platform CLI or Git integration

### Frontend Deployment (Vercel/Netlify)
1. Build production bundle: `npm run build`
2. Deploy `dist` folder
3. Configure API URL environment variable

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) for sample images

---

## 📧 Contact

Your Name - [@rza1914](https://github.com/rza1914)

Project Link: [https://github.com/rza1914/multilingual-ecommerce-template](https://github.com/rza1914/multilingual-ecommerce-template)

---

<div align="center">

Made with ❤️ by [rza1914](https://github.com/rza1914)

⭐ Star this repo if you find it helpful!

</div>
