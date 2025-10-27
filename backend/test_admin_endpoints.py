import requests
import json

# Login as admin
response = requests.post('http://127.0.0.1:8000/api/v1/auth/token',
                        data={'username': 'admin', 'password': 'admin123'})
token = response.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

print('=== Testing Admin Dashboard Endpoints ===\n')

# Test stats endpoint
stats = requests.get('http://127.0.0.1:8000/api/v1/admin/dashboard/stats', headers=headers)
print(f'1. Stats Endpoint - Status: {stats.status_code}')
if stats.status_code == 200:
    data = stats.json()
    print(f'   [OK] Total Users: {data["total_users"]}')
    print(f'   [OK] Total Products: {data["total_products"]}')
    print(f'   [OK] Total Orders: {data["total_orders"]}')
    print(f'   [OK] Total Revenue: ${data["total_revenue"]:.2f}')
else:
    print(f'   [ERROR] {stats.json()}')

print()

# Test recent orders endpoint
recent = requests.get('http://127.0.0.1:8000/api/v1/admin/dashboard/recent-orders?limit=5',
                     headers=headers)
print(f'2. Recent Orders Endpoint - Status: {recent.status_code}')
if recent.status_code == 200:
    print(f'   [OK] Orders Count: {len(recent.json())}')
else:
    print(f'   [ERROR] {recent.json()}')

print()

# Test revenue chart endpoint
chart = requests.get('http://127.0.0.1:8000/api/v1/admin/dashboard/revenue-chart?days=7',
                    headers=headers)
print(f'3. Revenue Chart Endpoint - Status: {chart.status_code}')
if chart.status_code == 200:
    print(f'   [OK] Data Points: {len(chart.json())}')
else:
    print(f'   [ERROR] {chart.json()}')

print('\n=== Testing Complete ===')
