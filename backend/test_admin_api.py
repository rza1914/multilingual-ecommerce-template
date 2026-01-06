import requests
import json

BASE_URL = 'http://localhost:8000/api/v1'

# Step 1: Login
print('=== Step 1: Login ===')
# Using username instead of email, as the auth endpoint uses OAuth2PasswordRequestForm
login_response = requests.post(
    f'{BASE_URL}/auth/login',
    data={'username': 'admin1', 'password': 'admin123'}  # Note: using form data, not JSON
)
print(f'Login Status: {login_response.status_code}')
print(f'Login Response: {login_response.text[:500]}')

if login_response.status_code != 200:
    print('Login failed!')
    exit(1)

# Get token from response
token_data = login_response.json()
token = token_data.get('access_token') or token_data.get('token')
print(f'Token: {token[:50] if token else "NO TOKEN"}...')

# Step 2: Test Dashboard Stats
print('\n=== Step 2: Dashboard Stats ===')
headers = {'Authorization': f'Bearer {token}'}
stats_response = requests.get(
    f'{BASE_URL}/admin/dashboard/stats',
    headers=headers
)
print(f'Stats Status: {stats_response.status_code}')
print(f'Stats Response: {stats_response.text[:1000]}')

# Step 3: Test Recent Orders
print('\n=== Step 3: Recent Orders ===')
orders_response = requests.get(
    f'{BASE_URL}/admin/dashboard/recent-orders?limit=5',
    headers=headers
)
print(f'Orders Status: {orders_response.status_code}')
print(f'Orders Response: {orders_response.text[:1000]}')

print('\n=== Done ===')