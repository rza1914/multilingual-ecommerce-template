# PowerShell Commands for API Testing

This document provides correct syntax for testing the e-commerce API in PowerShell environments.

## Using curl in PowerShell

### Method 1: Using curl with PowerShell-specific syntax
```powershell
# For GET requests
curl -X GET "http://localhost:8000/api/v1/products/" -H "Content-Type: application/json"

# For POST requests
curl -X POST "http://localhost:8000/api/v1/auth/token" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=admin@test.com&password=admin123"

# For smart search
curl -X POST "http://localhost:8000/api/v1/products/smart-search" `
  -H "Content-Type: application/json" `
  -d '{"query": "wireless headphones", "limit": 5}' | ConvertFrom-Json
```

### Method 2: Using PowerShell's native Invoke-RestMethod
```powershell
# For POST requests (recommended for PowerShell)
$headers = @{
    "Content-Type" = "application/x-www-form-urlencoded"
}

$body = "username=admin@test.com&password=admin123"
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/token" -Method Post -Headers $headers -Body $body
$response  # View the response

# For JSON POST requests
$jsonBody = @{
    query = "wireless headphones"
    limit = 5
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/products/smart-search" -Method Post -Headers $headers -Body $jsonBody
$response  # View the response
```

### Method 3: Using Invoke-WebRequest (detailed control)
```powershell
# Example 1: Authentication
$body = "username=admin@test.com&password=admin123"
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/token" `
  -Method POST `
  -ContentType "application/x-www-form-urlencoded" `
  -Body $body

# Parse the response
$authResult = $response.Content | ConvertFrom-Json
$token = $authResult.access_token

# Example 2: Authenticated request using token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{ query = "laptop"; limit = 10 } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/products/smart-search" `
  -Method POST `
  -Headers $headers `
  -Body $body

# View the result
$response.Content | ConvertFrom-Json
```

## Common PowerShell API Testing Patterns

### Setting up variables
```powershell
$baseUrl = "http://localhost:8000"
$token = "your_access_token_here"  # If you have a token
$headers = @{
    "Content-Type" = "application/json"
}

if ($token) {
    $headers["Authorization"] = "Bearer $token"
}
```

### Testing product endpoints
```powershell
# Get products
$products = Invoke-RestMethod -Uri "$baseUrl/api/v1/products/" -Method Get -Headers $headers

# Smart search
$body = @{
    query = "smartphone"
    category = "mobile"
    limit = 5
} | ConvertTo-Json

$searchResults = Invoke-RestMethod -Uri "$baseUrl/api/v1/products/smart-search" -Method Post -Headers $headers -Body $body
```

## Troubleshooting PowerShell API Calls

### Issue 1: SSL/TLS errors
```powershell
# Add this at the beginning of your PowerShell session to bypass SSL validation (for development only)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

### Issue 2: Invalid JSON responses
```powershell
# If ConvertFrom-Json fails, check the raw content
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/products/" -Method Get
Write-Host $response.Content
```

### Issue 3: Parameter encoding issues
```powershell
# For complex parameters, use proper encoding
$body = @{
    query = [System.Web.HttpUtility]::UrlEncode("search term")
} | ConvertTo-Json
```

## Complete Example Script
```powershell
# Complete API test script
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$baseUrl = "http://localhost:8000"

# Step 1: Login to get token
$loginBody = "username=admin@test.com&password=admin123"
$loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/token" `
  -Method POST `
  -ContentType "application/x-www-form-urlencoded" `
  -Body $loginBody

$authResult = $loginResponse.Content | ConvertFrom-Json
$token = $authResult.access_token

Write-Host "Login successful, token: $token"

# Step 2: Use token for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 3: Test smart search
$searchBody = @{
    query = "wireless headphones"
    limit = 5
} | ConvertTo-Json

$searchResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/products/smart-search" `
  -Method POST `
  -Headers $headers `
  -Body $searchBody

$result = $searchResponse.Content | ConvertFrom-Json
Write-Host "Search returned $($result.total_results) results"

# Display first result
if ($result.results.Count -gt 0) {
    Write-Host "First result: $($result.results[0].product.title)"
    Write-Host "Relevance: $($result.results[0].relevance_score)"
}
```

## Notes
- Use `Invoke-RestMethod` for simpler JSON handling (recommended)
- Use `Invoke-WebRequest` when you need more control over headers and response
- Use `ConvertTo-Json` to convert PowerShell objects to JSON
- Use `ConvertFrom-Json` to convert JSON strings to PowerShell objects
- For Windows PowerShell, you may need to set execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`