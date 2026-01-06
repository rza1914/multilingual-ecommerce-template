"""
Admin Dashboard Pydantic Schemas
Defines request/response models for admin API endpoints
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime


class RevenueChartData(BaseModel):
    """Single data point for revenue chart"""
    date: str = Field(..., description="Date in ISO format (YYYY-MM-DD)")
    revenue: float = Field(default=0.0, description="Revenue for this date")
    orders: int = Field(default=0, description="Number of orders for this date")


class TopProductResponse(BaseModel):
    """Top selling product information"""
    id: int = Field(..., description="Product ID")
    name: str = Field(..., description="Product name")
    price: float = Field(default=0.0, description="Product price")
    total_sold: int = Field(default=0, description="Total quantity sold")


class RecentOrderResponse(BaseModel):
    """Recent order summary for dashboard"""
    id: int = Field(..., description="Order ID")
    customer_name: str = Field(default="Guest", description="Customer name")
    total_amount: float = Field(default=0.0, description="Order total")
    status: str = Field(default="pending", description="Order status")
    created_at: str = Field(..., description="Order creation timestamp")


class DashboardData(BaseModel):
    """Dashboard statistics data"""
    total_revenue: float = Field(default=0.0, description="Total revenue (all time)")
    recent_revenue: float = Field(default=0.0, description="Revenue in last 30 days")
    total_orders: int = Field(default=0, description="Total number of orders")
    total_users: int = Field(default=0, description="Total active users")
    total_products: int = Field(default=0, description="Total active products")
    revenue_chart: List[RevenueChartData] = Field(default=[], description="Revenue chart data (last 7 days)")
    orders_by_status: Dict[str, int] = Field(default={}, description="Order count by status")
    top_products: List[TopProductResponse] = Field(default=[], description="Top 5 selling products")
    recent_orders: List[RecentOrderResponse] = Field(default=[], description="Last 10 orders")


class DashboardStatsResponse(BaseModel):
    """API response wrapper for dashboard stats"""
    success: bool = Field(default=True, description="Request success status")
    data: DashboardData = Field(..., description="Dashboard statistics data")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
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
                        "completed": 100,
                        "cancelled": 5
                    },
                    "top_products": [
                        {"id": 1, "name": "Product A", "price": 99.99, "total_sold": 50}
                    ],
                    "recent_orders": [
                        {
                            "id": 1,
                            "customer_name": "John Doe",
                            "total_amount": 299.99,
                            "status": "pending",
                            "created_at": "2024-01-15T10:30:00"
                        }
                    ]
                }
            }
        }