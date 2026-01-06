# Troubleshooting Guide

## Login Issues

### Problem: API calls return 404 with double /api/v1 prefix

**Symptoms:**
- Console shows URLs like: `http://localhost:8000/api/v1/api/v1/products/`
- Network tab shows 404 errors
- API configuration shows as valid

**Root Cause:**
- `BASE_URL` contains `/api/v1` prefix
- ENDPOINTS also contained `/api/v1` prefix
- Result: double prefix

**Solution (Applied):**
✅ All ENDPOINTS now use relative paths (no `/api/v1`)
✅ Only `BASE_URL` contains the API prefix
✅ `buildUrl()` helper constructs correct URLs

**Verify Fix:**
```javascript
// In browser console:
console.log({
  baseUrl: API_CONFIG.BASE_URL,
  productEndpoint: API_CONFIG.ENDPOINTS.PRODUCTS.LIST,
  fullUrl: API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.LIST)
});

// Expected output:
// baseUrl: "http://localhost:8000/api/v1"
// productEndpoint: "/products/"
// fullUrl: "http://localhost:8000/api/v1/products/"
```

---

### Problem: Login fails with network error

**Symptoms:**
- Login button doesn't work
- Console shows `VITE_API_URL: undefined`
- Network tab shows 404 errors

**Solution:**

1. **Check environment file exists:**
   ```bash
   ls -la frontend/.env.development
   ```
   If not found, create it with:
   ```bash
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_DEBUG=true
   ```

2. **Restart development server:**
   ```bash
   # Stop current server (Ctrl+C)
   cd frontend
   npm run dev
   ```

3. **Verify environment loaded:**
   - Open browser console
   - Look for "🔧 API Configuration"
   - Should show: `Using: http://localhost:8000/api/v1`

4. **Check backend is running:**
   ```bash
   curl http://localhost:8000/api/v1/health
   ```

---

## URL Construction

### Correct Pattern:
```typescript
// ✅ CORRECT
BASE_URL: 'http://localhost:8000/api/v1'
ENDPOINT: '/products/'
Full URL: 'http://localhost:8000/api/v1/products/'

// ❌ WRONG (causes double prefix)
BASE_URL: 'http://localhost:8000/api/v1'
ENDPOINT: '/api/v1/products/'
Full URL: 'http://localhost:8000/api/v1/api/v1/products/'
```

### Using API Helper:
```typescript
import { API_CONFIG } from '@/config/api.config';
import { buildApiUrl } from '@/services/api.service';

// Method 1: Using config helper
const url = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.LIST);

// Method 2: Using service helper
const url = buildApiUrl('/products/');

// Both produce: 'http://localhost:8000/api/v1/products/'
```

---

## Environment Variable Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:8000/api/v1` | Backend API base URL (must include /api/v1) |
| `VITE_DEBUG` | ❌ No | `true` | Enable debug logging |
| `VITE_WS_URL` | ❌ No | `ws://localhost:8000/ws` | WebSocket URL |

⚠️ **Important:** `VITE_API_URL` must include the `/api/v1` prefix!

---

## Data Loading Issues

### Problem: Component crashes with "Cannot read property 'length' of undefined"

**Symptoms:**
- API call succeeds (200 OK in Network tab)
- Component crashes when rendering
- Console error: `Cannot read properties of undefined (reading 'length')`

**Root Cause:**
- API response structure doesn't match expected format
- Service returns `undefined` instead of empty array on error
- Component tries to access properties on undefined value

**Solution (Applied):**
✅ All service methods now return safe fallback values:
- List methods return `[]` (empty array)
- Detail methods return `null`
- Never throw errors to components

**Verify Fix:**
```javascript
// In browser console:
import { getFeaturedProducts } from './services/product.service';

const products = await getFeaturedProducts();
console.log(Array.isArray(products)); // Should be true
console.log(products.length); // Should work (0 or more)
```

---

### Understanding Response Normalization

The product service now automatically handles various API response formats:

```typescript
// Format 1: Direct array in data
{ "data": [...] }  ✅ Supported

// Format 2: Nested data property
{ "data": { "data": [...], "total": 100 } }  ✅ Supported

// Format 3: Items property
{ "items": [...], "count": 50 }  ✅ Supported

// Format 4: Results property (DRF style)
{ "results": [...], "next": "...", "previous": "..." }  ✅ Supported

// Format 5: Direct array
[...]  ✅ Supported
```

**Debug Response Structure:**
```bash
# Enable debug logging
VITE_DEBUG=true

# Console will show:
# [Product Service] Raw API response: { data: [...] }
# [Product Service] Featured products fetched: 6 items
```

---

### Problem: Empty product lists even though API returns data

**Check:**
1. **Enable debug mode:**
   ```bash
   # In .env.development
   VITE_DEBUG=true
   ```

2. **Check console logs:**
   ```
   [Product Service] Raw API response: ...
   [Product Service] Featured products fetched: X items
   ```

3. **Verify response structure:**
   - Open Network tab
   - Find the API call
   - Check Response tab
   - Compare with supported formats above

**If your API uses different structure:**
1. Note the structure
2. Add new case to `normalizeProductListResponse()`
3. Example:
   ```typescript
   // If API returns { products: [...] }
   if (response.data?.products && Array.isArray(response.data.products)) {
     return response.data.products;
   }
   ```

---

### Best Practices

**Always use service methods (don't call API directly):**
```typescript
// ✅ GOOD - uses normalization
import * as productService from '@services/product.service';
const products = await productService.getFeaturedProducts();

// ❌ BAD - no normalization
import { api } from '@services/api.service';
const response = await api.get('/products/');
const products = response.data.data; // Might be undefined!
```

**Always handle arrays safely:**
```typescript
// ✅ GOOD - safe
{products?.length > 0 && products.map(...)}

// ✅ BETTER - explicit check
{Array.isArray(products) && products.length > 0 && products.map(...)}

// ❌ BAD - can crash
{products.length > 0 && products.map(...)}
```

---

## Quick Diagnostic Commands

### Check API Configuration:
```javascript
// In browser console:
API_CONFIG.validate();
```

### Check Sample URLs:
```javascript
console.log('Products:', API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.LIST));
console.log('Login:', API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN));
```

### Monitor API Calls:
```javascript
// Enable debug mode temporarily:
localStorage.setItem('VITE_DEBUG', 'true');
location.reload();
```