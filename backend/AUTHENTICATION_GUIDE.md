# 🔧 راهنمای رفع خطای 401 Unauthorized

این راهنما به شما کمک می‌کند مشکل احراز هویت 401 را حل کنید.

## 🚀 مراحل سریع (Quick Fix)

### گام 1️⃣: اجرای ابزار تشخیص

```bash
# در پوشه backend
python diagnose_auth.py
```

یا در Windows:
```
دابل کلیک روی: diagnose_auth.bat
```

این ابزار:
- ✅ پایگاه داده را بررسی می‌کند
- ✅ کاربر ادمین ایجاد می‌کند (اگر وجود نداشته باشد)
- ✅ سیستم احراز هویت را تست می‌کند
- ✅ توکن معتبر تولید می‌کند

### گام 2️⃣: راه‌اندازی سرور

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### گام 3️⃣: دریافت توکن

با Postman یا curl:

```bash
POST http://localhost:8000/api/v1/auth/token
Content-Type: application/x-www-form-urlencoded

username=admin@test.com
password=admin123
```

پاسخ:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### گام 4️⃣: استفاده از توکن

```bash
GET http://localhost:8000/api/v1/users/me
Authorization: Bearer <your_token_here>
```

---

## 🔍 دلایل احتمالی خطای 401

### 1. توکن ارسال نشده است

❌ **اشتباه:**
```javascript
fetch('/api/v1/users/me')  // بدون هدر Authorization
```

✅ **درست:**
```javascript
const token = localStorage.getItem('token');
fetch('/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 2. فرمت توکن اشتباه است

❌ **اشتباه:**
```
Authorization: eyJhbGci...  // بدون Bearer
Authorization: Token eyJhbGci...  // Token به جای Bearer
```

✅ **درست:**
```
Authorization: Bearer eyJhbGci...
```

### 3. توکن منقضی شده است

توکن‌ها به طور پیش‌فرض 30 دقیقه اعتبار دارند. باید دوباره لاگین کنید.

```javascript
// بررسی کنید آیا پاسخ 401 است
if (response.status === 401) {
  // توکن منقضی شده - کاربر را به صفحه لاگین ببرید
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

### 4. کاربر ادمین نیست

اگر endpoint نیاز به دسترسی ادمین دارد، باید با کاربر ادمین لاگین کنید.

```python
# این endpoint فقط برای ادمین است
@router.get("/users", dependencies=[Depends(get_current_admin_user)])
```

---

## 🛠️ تست با ابزارهای مختلف

### تست با Postman

1. ایجاد یک Collection جدید
2. افزودن request برای Login:
   - Method: `POST`
   - URL: `http://localhost:8000/api/v1/auth/token`
   - Body (x-www-form-urlencoded):
     - `username`: `admin@test.com`
     - `password`: `admin123`
3. کپی کردن `access_token` از Response
4. افزودن request جدید:
   - Method: `GET`
   - URL: `http://localhost:8000/api/v1/users/me`
   - Headers:
     - `Authorization`: `Bearer <paste_token_here>`

### تست با curl

```bash
# دریافت توکن
curl -X POST "http://localhost:8000/api/v1/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@test.com&password=admin123"

# استفاده از توکن
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer <your_token>"
```

### تست با JavaScript/Axios

```javascript
// لاگین
const loginResponse = await axios.post('http://localhost:8000/api/v1/auth/token', 
  new URLSearchParams({
    username: 'admin@test.com',
    password: 'admin123'
  })
);

const token = loginResponse.data.access_token;
localStorage.setItem('token', token);

// استفاده از توکن
const userResponse = await axios.get('http://localhost:8000/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(userResponse.data);
```

---

## 🐛 دیباگ پیشرفته

### فعال‌سازی لاگ‌های تشخیصی

در فایل `app/core/auth.py` لاگ اضافه کنید:

```python
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    print(f"🔍 Token received: {token[:20]}...")  # Debug
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(f"✅ Token decoded: {payload}")  # Debug
        
        user_id: str = payload.get("sub")
        if user_id is None:
            print("❌ No user_id in token")  # Debug
            raise credentials_exception
    except JWTError as e:
        print(f"❌ JWT Error: {e}")  # Debug
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        print(f"❌ User {user_id} not found")  # Debug
        raise credentials_exception
    
    print(f"✅ User found: {user.email}, Role: {user.role}")  # Debug
    return user
```

### بررسی CORS

اگر از فرانت‌اند متفاوتی استفاده می‌کنید، مطمئن شوید CORS فعال است:

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # آدرس فرانت‌اند شما
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### بررسی مستقیم دیتابیس

```python
# در Python REPL
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()
users = db.query(User).all()

for user in users:
    print(f"{user.email} - {user.role} - Active: {user.is_active}")
```

---

## 📚 سناریوهای رایج

### سناریو 1: اولین بار که پروژه را اجرا می‌کنم

```bash
# گام 1: ایجاد دیتابیس و کاربر ادمین
python diagnose_auth.py

# گام 2: شروع سرور
python -m uvicorn app.main:app --reload

# گام 3: لاگین با admin@test.com / admin123
```

### سناریو 2: من یک کاربر ادمین دارم ولی توکنم کار نمی‌کند

1. مطمئن شوید توکن در هدر ارسال می‌شود:
   ```javascript
   headers: { 'Authorization': `Bearer ${token}` }
   ```

2. بررسی کنید توکن منقضی نشده باشد (عمر: 30 دقیقه)

3. دوباره لاگین کنید و توکن جدید بگیرید

### سناریو 3: من کاربر معمولی هستم و می‌خواهم دسترسی ادمین داشته باشم

```python
# در Python
from app.database import SessionLocal
from app.models.user import User, UserRole

db = SessionLocal()
user = db.query(User).filter(User.email == "your@email.com").first()
user.role = UserRole.ADMIN
db.commit()
print(f"✅ {user.email} is now an admin!")
```

یا با اسکریپت:

```bash
python create_admin.py
```

---

## ✅ چک‌لیست نهایی

قبل از تماس برای پشتیبانی، این موارد را بررسی کنید:

- [ ] سرور روشن است و در حال اجرا است
- [ ] کاربر ادمین وجود دارد (با `diagnose_auth.py` بررسی کنید)
- [ ] توکن معتبر دریافت کرده‌اید
- [ ] توکن در فرمت `Bearer <token>` ارسال می‌شود
- [ ] هدر `Authorization` در درخواست وجود دارد
- [ ] CORS برای فرانت‌اند شما فعال است
- [ ] توکن منقضی نشده است (کمتر از 30 دقیقه قدمت دارد)

---

## 📞 پشتیبانی

اگر همچنان مشکل دارید:

1. خروجی `diagnose_auth.py` را کپی کنید
2. لاگ‌های سرور را کپی کنید
3. درخواست HTTP کامل (با هدرها) را کپی کنید
4. با پشتیبانی تماس بگیرید

---

**نکته مهم:** این سیستم احراز هویت از استاندارد OAuth2 + JWT استفاده می‌کند که بسیار امن و قابل اعتماد است. اکثر مشکلات از تنظیمات نادرست فرانت‌اند ناشی می‌شوند، نه بک‌اند.
