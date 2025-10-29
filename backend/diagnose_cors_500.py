"""
Quick diagnostic script for CORS and 500 errors
"""
import sys
import traceback

def check_imports():
    """Check if all required modules can be imported"""
    print("\n" + "="*60)
    print("📦 Checking Imports")
    print("="*60)
    
    modules = [
        "fastapi",
        "sqlalchemy",
        "pydantic",
        "passlib",
        "python_jose",
        "python_multipart",
        "decouple",
    ]
    
    failed = []
    for module in modules:
        try:
            __import__(module.replace("_", "-"))
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            failed.append(module)
    
    if failed:
        print("\n⚠️  Missing modules! Run:")
        print("pip install " + " ".join(failed))
        return False
    
    print("\n✅ All modules imported successfully!")
    return True

def check_database():
    """Check if database exists and has correct schema"""
    print("\n" + "="*60)
    print("💾 Checking Database")
    print("="*60)
    
    import os
    
    if not os.path.exists("ecommerce.db"):
        print("❌ Database file not found: ecommerce.db")
        print("\n🔧 Fix:")
        print("python recreate_database.py")
        return False
    
    print(f"✅ Database file exists: {os.path.getsize('ecommerce.db')} bytes")
    
    # Try to query database
    try:
        from app.database import SessionLocal
        from app.models.product import Product
        
        db = SessionLocal()
        try:
            count = db.query(Product).count()
            print(f"✅ Products table accessible: {count} products")
            
            # Check for required columns
            first_product = db.query(Product).first()
            if first_product:
                required_fields = ['discount', 'stock', 'rating', 'title_en']
                missing = []
                for field in required_fields:
                    if not hasattr(first_product, field):
                        missing.append(field)
                
                if missing:
                    print(f"❌ Missing columns: {', '.join(missing)}")
                    print("\n🔧 Fix:")
                    print("del *.db*")
                    print("python recreate_database.py")
                    return False
                else:
                    print(f"✅ All required columns present")
            
            return True
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Database error: {e}")
        print("\n🔧 Fix:")
        print("del *.db*")
        print("python recreate_database.py")
        return False

def check_config():
    """Check if config is correct"""
    print("\n" + "="*60)
    print("⚙️  Checking Configuration")
    print("="*60)
    
    try:
        from app.config import settings
        
        print(f"✅ Environment: {settings.ENVIRONMENT}")
        print(f"✅ CORS Origins: {len(settings.ALLOWED_ORIGINS)}")
        
        for i, origin in enumerate(settings.ALLOWED_ORIGINS[:3]):
            print(f"   {i+1}. {origin}")
        
        if len(settings.ALLOWED_ORIGINS) > 3:
            print(f"   ... and {len(settings.ALLOWED_ORIGINS) - 3} more")
        
        print(f"✅ Database URL: {settings.DATABASE_URL}")
        
        return True
        
    except Exception as e:
        print(f"❌ Config error: {e}")
        traceback.print_exc()
        return False

def check_api_routes():
    """Check if API routes are accessible"""
    print("\n" + "="*60)
    print("🌐 Checking API Routes")
    print("="*60)
    
    try:
        from app.main import app
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        
        # Test root endpoint
        response = client.get("/")
        if response.status_code == 200:
            print("✅ Root endpoint (/)")
        else:
            print(f"❌ Root endpoint: {response.status_code}")
        
        # Test health endpoint
        response = client.get("/health")
        if response.status_code == 200:
            print("✅ Health endpoint (/health)")
        else:
            print(f"❌ Health endpoint: {response.status_code}")
        
        # Test products endpoint
        response = client.get("/api/v1/products/?limit=6")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Products endpoint: {len(data)} products")
        else:
            print(f"❌ Products endpoint: {response.status_code}")
            print(f"   Error: {response.text[:200]}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ API routes error: {e}")
        traceback.print_exc()
        return False

def main():
    print("\n" + "🔍" * 30)
    print("CORS and 500 Error Diagnostic Tool")
    print("🔍" * 30)
    
    results = {
        "imports": False,
        "database": False,
        "config": False,
        "api": False
    }
    
    # Run checks
    results["imports"] = check_imports()
    
    if results["imports"]:
        results["database"] = check_database()
        results["config"] = check_config()
        
        if results["database"] and results["config"]:
            results["api"] = check_api_routes()
    
    # Summary
    print("\n" + "="*60)
    print("📋 DIAGNOSTIC SUMMARY")
    print("="*60)
    
    all_pass = all(results.values())
    
    for check, passed in results.items():
        status = "✅" if passed else "❌"
        print(f"{status} {check.capitalize()}")
    
    print("\n" + "="*60)
    
    if all_pass:
        print("✅ ALL CHECKS PASSED!")
        print("\n🚀 Server should work correctly!")
        print("\nStart backend:")
        print("python -m uvicorn app.main:app --reload")
    else:
        print("❌ SOME CHECKS FAILED!")
        print("\n🔧 RECOMMENDED FIXES:")
        
        if not results["imports"]:
            print("\n1. Install missing packages:")
            print("   pip install -r requirements.txt")
        
        if not results["database"]:
            print("\n2. Recreate database:")
            print("   del *.db*")
            print("   python recreate_database.py")
        
        if not results["config"]:
            print("\n3. Check config file:")
            print("   Make sure app/config.py exists and is correct")
        
        if not results["api"]:
            print("\n4. After fixing above issues, restart backend")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        traceback.print_exc()
