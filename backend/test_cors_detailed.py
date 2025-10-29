#!/usr/bin/env python3
"""
Test CORS configuration by making an OPTIONS request
"""
import requests

def test_cors():
    """Test CORS preflight request"""
    url = "http://localhost:8000/api/v1/products/"
    
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "X-Requested-With"
    }
    
    print("=" * 60)
    print("🧪 Testing CORS Preflight (OPTIONS Request)")
    print("=" * 60)
    print(f"URL: {url}")
    print(f"Origin: {headers['Origin']}")
    print(f"Request Method: OPTIONS")
    print(f"Requested Method: {headers['Access-Control-Request-Method']}")
    print(f"Requested Headers: {headers['Access-Control-Request-Headers']}")
    print("=" * 60)
    
    try:
        response = requests.options(url, headers=headers)
        
        print(f"\n✅ Response Status: {response.status_code}")
        print("\n📋 Response Headers:")
        print("-" * 60)
        
        # Check for CORS headers
        cors_headers = {
            'access-control-allow-origin': False,
            'access-control-allow-methods': False,
            'access-control-allow-headers': False,
            'access-control-allow-credentials': False,
            'access-control-max-age': False,
        }
        
        for header, value in response.headers.items():
            header_lower = header.lower()
            if 'access-control' in header_lower:
                print(f"✅ {header}: {value}")
                if header_lower in cors_headers:
                    cors_headers[header_lower] = True
            else:
                print(f"   {header}: {value}")
        
        print("\n" + "=" * 60)
        print("📊 CORS Configuration Check:")
        print("=" * 60)
        
        for header, present in cors_headers.items():
            status = "✅ Present" if present else "❌ Missing"
            print(f"{status} - {header}")
        
        # Check specific values
        print("\n" + "=" * 60)
        print("🔍 Detailed CORS Analysis:")
        print("=" * 60)
        
        allow_origin = response.headers.get('Access-Control-Allow-Origin', 'NOT SET')
        allow_methods = response.headers.get('Access-Control-Allow-Methods', 'NOT SET')
        allow_headers = response.headers.get('Access-Control-Allow-Headers', 'NOT SET')
        allow_credentials = response.headers.get('Access-Control-Allow-Credentials', 'NOT SET')
        
        print(f"\n1. Origin Check:")
        if 'localhost:5173' in allow_origin or allow_origin == '*':
            print(f"   ✅ Frontend origin allowed: {allow_origin}")
        else:
            print(f"   ❌ Frontend origin NOT allowed: {allow_origin}")
        
        print(f"\n2. Methods Check:")
        required_methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        if allow_methods != 'NOT SET':
            methods_list = [m.strip().upper() for m in allow_methods.split(',')]
            missing_methods = [m for m in required_methods if m not in methods_list]
            if not missing_methods:
                print(f"   ✅ All required methods allowed: {allow_methods}")
            else:
                print(f"   ⚠️  Missing methods: {missing_methods}")
                print(f"   Allowed: {allow_methods}")
        else:
            print(f"   ❌ No methods header set")
        
        print(f"\n3. Headers Check:")
        required_headers = ['Content-Type', 'Authorization', 'X-Requested-With']
        if allow_headers != 'NOT SET':
            if allow_headers == '*':
                print(f"   ⚠️  Wildcard headers: {allow_headers}")
            else:
                headers_list = [h.strip().lower() for h in allow_headers.split(',')]
                missing_headers = [h for h in required_headers if h.lower() not in headers_list]
                if not missing_headers:
                    print(f"   ✅ All required headers allowed")
                else:
                    print(f"   ⚠️  Some headers missing from explicit list")
                print(f"   Allowed: {allow_headers}")
        else:
            print(f"   ❌ No headers configuration")
        
        print(f"\n4. Credentials Check:")
        if allow_credentials.lower() == 'true':
            print(f"   ✅ Credentials enabled: {allow_credentials}")
        else:
            print(f"   ❌ Credentials NOT enabled: {allow_credentials}")
        
        # Final verdict
        print("\n" + "=" * 60)
        all_good = all(cors_headers.values()) and 'localhost:5173' in allow_origin
        if all_good:
            print("🎉 CORS CONFIGURATION: ✅ WORKING CORRECTLY")
            print("Frontend at localhost:5173 can communicate with backend!")
        else:
            print("⚠️  CORS CONFIGURATION: NEEDS ATTENTION")
            print("Some CORS headers are missing or misconfigured")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend")
        print("   Make sure backend is running on http://localhost:8000")
        print("   Start with: cd backend && python run.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_cors()
