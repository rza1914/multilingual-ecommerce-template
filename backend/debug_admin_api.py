import requests
import json

BASE_URL = 'http://localhost:8000/api/v1'

# Login first
print('=== Login ===')
login_response = requests.post(
    f'{BASE_URL}/auth/login',
    data={'username': 'admin1', 'password': 'admin123'}
)
print(f'Login Status: {login_response.status_code}')

if login_response.status_code != 200:
    print('Login failed!')
    print(login_response.text)
else:
    token_data = login_response.json()
    token = token_data.get('access_token')
    headers = {'Authorization': f'Bearer {token}'}
    
    print(f'Token: {token[:30]}...')
    
    # Test a simple endpoint to make sure the server is working
    print('\n=== Test Me Endpoint ===')
    me_response = requests.get(f'{BASE_URL}/auth/me', headers=headers)
    print(f'Me Status: {me_response.status_code}')
    print(f'Me Response: {me_response.text[:500]}')
    
    # Test dashboard stats with more details
    print('\n=== Test Dashboard Stats ===')
    stats_response = requests.get(f'{BASE_URL}/admin/dashboard/stats', headers=headers)
    print(f'Stats Status: {stats_response.status_code}')
    print(f'Stats Response: {stats_response.text}')
    
    # Check if there are any missing dependencies or imports
    print('\n=== Test Basic Admin Endpoint ===')
    orders_response = requests.get(f'{BASE_URL}/admin/dashboard/recent-orders', headers=headers)
    print(f'Recent Orders Status: {orders_response.status_code}')
    print(f'Recent Orders Response: {orders_response.text}')