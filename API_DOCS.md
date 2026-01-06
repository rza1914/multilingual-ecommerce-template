## Admin Dashboard API

### GET /api/v1/admin/dashboard/stats

Get comprehensive dashboard statistics for admin panel.

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_revenue": 125000.50,
    "recent_revenue": 45000.00,
    "total_orders": 150,
    "total_users": 89,
    "total_products": 45,
    "revenue_chart": [
      {"date": "2024-01-01", "revenue": 5000.0, "orders": 10}
    ],
    "orders_by_status": {
      "pending": 5,
      "processing": 10,
      "completed": 100
    },
    "top_products": [...],
    "recent_orders": [...]
  }
}
```

**Error Codes:**
- 401: Unauthorized - Not logged in or not admin
- 500: Internal Server Error - Database query failed