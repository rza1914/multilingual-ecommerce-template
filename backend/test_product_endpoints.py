#!/usr/bin/env python3
# Test script for admin product endpoints

import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api/v1'

# Login as admin
print('=== Testing Admin Product Endpoints ===\n')
print('1. Logging in as admin...')
response = requests.post(f'{BASE_URL}/auth/token', data={
    'username': 'admin',
    'password': 'admin123'
})
token = response.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}
print(f'   [OK] Logged in successfully\n')

# Test 1: Get all products
print('2. GET /admin/products (list all products)')
response = requests.get(f'{BASE_URL}/admin/products', headers=headers)
print(f'   Status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'   [OK] Total products: {data["total"]}')
    print(f'   [OK] Products returned: {len(data["products"])}')
else:
    print(f'   [ERROR] {response.json()}')
print()

# Test 2: Create a product
print('3. POST /admin/products (create product)')
product_data = {
    'title': 'Test Product',
    'description': 'This is a test product created by admin',
    'price': 99.99,
    'category': 'Electronics',
    'image_url': 'https://example.com/product.jpg',
    'discount_price': 79.99,
    'is_active': True,
    'is_featured': True,
    'tags': 'test,admin,product'
}
response = requests.post(f'{BASE_URL}/admin/products', data=product_data, headers=headers)
print(f'   Status: {response.status_code}')
if response.status_code == 200:
    created_product = response.json()
    product_id = created_product['id']
    print(f'   [OK] Product created with ID: {product_id}')
    print(f'   [OK] Title: {created_product["title"]}')
    print(f'   [OK] Price: ${created_product["price"]}')
else:
    print(f'   [ERROR] {response.json()}')
    product_id = None
print()

# Test 3: Get single product
if product_id:
    print(f'4. GET /admin/products/{product_id} (get single product)')
    response = requests.get(f'{BASE_URL}/admin/products/{product_id}', headers=headers)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        product = response.json()
        print(f'   [OK] Product title: {product["title"]}')
        print(f'   [OK] Category: {product["category"]}')
    else:
        print(f'   [ERROR] {response.json()}')
    print()

# Test 4: Update product
if product_id:
    print(f'5. PUT /admin/products/{product_id} (update product)')
    updated_data = {
        'title': 'Updated Test Product',
        'description': 'This product has been updated',
        'price': 129.99,
        'category': 'Electronics',
        'image_url': 'https://example.com/updated-product.jpg',
        'discount_price': 99.99,
        'is_active': True,
        'is_featured': False,
        'tags': 'updated,test'
    }
    response = requests.put(f'{BASE_URL}/admin/products/{product_id}', data=updated_data, headers=headers)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        updated_product = response.json()
        print(f'   [OK] Product updated')
        print(f'   [OK] New title: {updated_product["title"]}')
        print(f'   [OK] New price: ${updated_product["price"]}')
    else:
        print(f'   [ERROR] {response.json()}')
    print()

# Test 5: Search products
print('6. GET /admin/products?search=Updated (search products)')
response = requests.get(f'{BASE_URL}/admin/products', params={'search': 'Updated'}, headers=headers)
print(f'   Status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'   [OK] Found {len(data["products"])} product(s)')
    if len(data["products"]) > 0:
        print(f'   [OK] First result: {data["products"][0]["title"]}')
else:
    print(f'   [ERROR] {response.json()}')
print()

# Test 6: Delete product
if product_id:
    print(f'7. DELETE /admin/products/{product_id} (delete product)')
    response = requests.delete(f'{BASE_URL}/admin/products/{product_id}', headers=headers)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        result = response.json()
        print(f'   [OK] {result["message"]}')
        print(f'   [OK] Deleted product ID: {result["id"]}')
    else:
        print(f'   [ERROR] {response.json()}')
    print()

# Verify deletion
if product_id:
    print(f'8. Verify deletion (GET /admin/products/{product_id})')
    response = requests.get(f'{BASE_URL}/admin/products/{product_id}', headers=headers)
    print(f'   Status: {response.status_code}')
    if response.status_code == 404:
        print('   [OK] Product successfully deleted (404 Not Found)')
    else:
        print(f'   [ERROR] Product still exists!')
    print()

print('=== All Tests Complete ===')
