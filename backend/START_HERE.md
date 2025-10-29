# 🚨 حل فوری مشکل 401 - راهنمای گام به گام

## 📍 شما اینجا هستید چون:
- خطای **401 Unauthorized** می‌گیرید
- نمی‌توانید به API دسترسی پیدا کنید
- لاگین کار نمی‌کند

## ✅ راه حل در 3 گام (زمان: 2 دقیقه)

### گام 1️⃣: اجرای تست‌ها (در Windows)

دابل کلیک روی این فایل:
```
run_all_tests.bat
```

این فایل به ترتیب:
1. کاربران موجود را نشان می‌دهد
2. کاربر ادمین ایجاد می‌کند (اگر نباشد)
3. سیستم احراز هویت را تست می‌کند

### گام 2️⃣: اطلاعات کاربر ادمین

پس از اجرای فایل بالا، این اطلاعات را دارید:

```
Email: admin@test.com
Username: admin
Password: admin123
```

### گام 3️⃣: تست با Postman

#### مرحله A: دریافت توکن

```http
POST http://localhost:8000/api/v1/auth/token
Content-Type: application/x-www-form-urlencoded

username=admin@test.com
password=admin123
```

**نتیجه:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### مرحله B: استفاده از توکن

```http
GET http://localhost:8000/api/v1/users/me
Authorization: Bearer eyJhbGc...
```

---

## 🐛 مشکلات رایج و راه حل

### ❌ مشکل: "Could not validate credentials"

**علت:** توکن اشتباه ارسال شده

**راه حل:**
```javascript
// ❌ اشتباه
Authorization: eyJhbGc...

// ✅ درست
Authorization: Bearer eyJhbGc...
```

### ❌ مشکل: "Not enough permissions"

**علت:** کاربر ادمین نیست

**راه حل:**
```bash
# اجرا کنید:
python create_or_verify_admin.py
```

### ❌ مشکل: "Incorrect username or password"

**علت:** اطلاعات اشتباه است

**راه حل:**
```bash
# ببینید چه کاربرانی دارید:
python check_users.py

# کاربر ادمین جدید بسازید:
python create_or_verify_admin.py
```

### ❌ مشکل: CORS Error در مرورگر

**علت:** فرانت‌اند روی پورت دیگری است

**راه حل:**

فایل `app/config.py` پیکربندی CORS دارد که در حالت development خودکار همه localhost ها را مجاز می‌کند.

اگر مشکل دارید، `.env` ایجاد کنید:
```
ENVIRONMENT=development
```

---

## 💻 کد نمونه برای فرانت‌اند

### React/Vue/JavaScript

```javascript
// لاگین
async function login() {
  const formData = new URLSearchParams();
  formData.append('username', 'admin@test.com');
  formData.append('password', 'admin123');

  const response = await fetch('http://localhost:8000/api/v1/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data.access_token;
}

// استفاده از توکن
async function getUserInfo() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // توکن منقضی شده - دوباره لاگین کنید
    localStorage.removeItem('token');
    await login();
    return getUserInfo(); // تلاش مجدد
  }

  return response.json();
}

// فراخوانی
const token = await login();
const user = await getUserInfo();
console.log(user);
```

### با Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
});

// اضافه کردن خودکار توکن
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// مدیریت خودکار 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // توکن منقضی شده
      localStorage.removeItem('token');
      
      // دوباره لاگین
      const formData = new URLSearchParams({
        username: 'admin@test.com',
        password: 'admin123'
      });
      
      const loginRes = await axios.post(
        'http://localhost:8000/api/v1/auth/token',
        formData
      );
      
      localStorage.setItem('token', loginRes.data.access_token);
      
      // تلاش مجدد برای درخواست اولیه
      error.config.headers.Authorization = `Bearer ${loginRes.data.access_token}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);

// استفاده
const user = await api.get('/users/me');
console.log(user.data);
```

---

## 🧪 تست با فایل HTML

فایل `test_auth.html` را در مرورگر باز کنید:

```
backend/test_auth.html
```

این صفحه یک رابط کاربری گرافیکی دارد و همه چیز را به صورت خودکار تست می‌کند.

---

## 📋 چک‌لیست قبل از تست

- [ ] سرور در حال اجرا است: `python -m uvicorn app.main:app --reload`
- [ ] کاربر ادمین دارید: `python check_users.py`
- [ ] توکن با فرمت `Bearer <token>` ارسال می‌شود
- [ ] هدر `Authorization` در درخواست وجود دارد
- [ ] توکن کمتر از 30 دقیقه قدمت دارد (تازه است)

---

## 🔥 دستورات سریع

```bash
# بررسی کاربران
python check_users.py

# ایجاد/بررسی ادمین
python create_or_verify_admin.py

# تست کامل سیستم (نیاز به سرور در حال اجرا)
python test_auth_flow.py

# اجرای همه در یک بار (Windows)
run_all_tests.bat

# راه‌اندازی سرور
python -m uvicorn app.main:app --reload
```

---

## 📚 فایل‌های مفید

| فایل | کاربرد |
|------|---------|
| `check_users.py` | لیست کاربران و ادمین‌ها |
| `create_or_verify_admin.py` | ایجاد کاربر ادمین |
| `test_auth_flow.py` | تست کامل احراز هویت |
| `test_auth.html` | تست با رابط گرافیکی |
| `run_all_tests.bat` | اجرای همه تست‌ها |
| `AUTHENTICATION_GUIDE.md` | راهنمای کامل |
| `FIX_401_ERROR.md` | این فایل! |

---

## 🎯 خلاصه مهم

1. **لاگین**: `POST /auth/token` با `username` و `password`
2. **دریافت توکن**: `access_token` از response
3. **استفاده**: `Authorization: Bearer <token>` در هدر
4. **مدت اعتبار**: 30 دقیقه
5. **تازه‌سازی**: دوباره لاگین کنید

**نکته طلایی:** 99% مشکلات 401 به خاطر فراموشی کلمه `Bearer` قبل از توکن است! ✨

---

## 🆘 کمک بیشتر

اگر همچنان مشکل دارید:

1. `run_all_tests.bat` را اجرا کنید
2. خروجی را کپی کنید
3. اسکرین‌شات از خطای Postman بگیرید
4. با پشتیبانی تماس بگیرید

موفق باشید! 🚀
