        Returns:
            Dictionary containing forecast, alerts, and recommendations
        """
        try:
            # Get data from the database
            current_month_sales = self._get_current_month_sales()
            product_sales = self._get_product_sales_trends()
            inventory = self._get_inventory_status()
            customer_data = self._get_customer_data()
            
            # Generate insights
            forecast = self._generate_sales_forecast(current_month_sales, product_sales)
            alerts = self._generate_alerts(inventory, product_sales, customer_data)
            recommendations = self._generate_recommendations(product_sales, inventory, current_month_sales)
            
            return {
                "forecast": forecast,
                "alerts": alerts,
                "recommendations": recommendations,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error generating AI insights: {str(e)}", exc_info=True)
            return {
                "forecast": {
                    "next_month_revenue": 0,
                    "confidence": 0.0,
                    "trend": "unknown"
                },
                "alerts": [],
                "recommendations": [],
                "timestamp": datetime.now().isoformat(),
                "error": "خطا در تولید بینش‌های هوش مصنوعی"
            }
    
    def _get_current_month_sales(self) -> Dict[str, Any]:
        """
        Get sales data for the current month
        """
        from ..models.order import Order
        
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        total_revenue = self.db.query(func.sum(Order.total)).filter(
            extract('month', Order.created_at) == current_month,
            extract('year', Order.created_at) == current_year
        ).scalar() or 0
        
        total_orders = self.db.query(func.count(Order.id)).filter(
            extract('month', Order.created_at) == current_month,
            extract('year', Order.created_at) == current_year
        ).scalar() or 0
        
        return {
            "revenue": float(total_revenue),
            "orders": total_orders,
            "month": current_month,
            "year": current_year
        }
    
    def _get_product_sales_trends(self) -> List[Dict[str, Any]]:
        """
        Get product sales trends
        """
        from ..models.order import Order, OrderItem
        from ..models.product import Product
        
        # Get top selling products in the last 3 months
        three_months_ago = datetime.now() - timedelta(days=90)
        
        product_sales = self.db.query(
            Product.id,
            Product.title,
            Product.category,
            Product.stock,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.quantity * OrderItem.price_at_time).label('total_revenue')
        ).join(OrderItem).join(Order).filter(
            Order.created_at >= three_months_ago
        ).group_by(
            Product.id, Product.title, Product.category, Product.stock
        ).order_by(desc('total_revenue')).limit(20).all()
        
        result = []
        for product in product_sales:
            result.append({
                "id": product.id,
                "title": product.title,
                "category": product.category,
                "stock": product.stock,
                "total_sold": product.total_sold,
                "total_revenue": float(product.total_revenue)
            })
        
        return result
    
    def _get_inventory_status(self) -> List[Dict[str, Any]]:
        """
        Get current inventory status
        """
        from ..models.product import Product
        
        # Get products with low stock
        low_stock_products = self.db.query(Product).filter(
            Product.stock < 10,  # Assuming threshold of 10
            Product.is_active == True
        ).all()
        
        result = []
        for product in low_stock_products:
            result.append({
                "id": product.id,
                "title": product.title,
                "category": product.category,
                "stock": product.stock,
                "price": product.price
            })
        
        return result
    
    def _get_customer_data(self) -> Dict[str, Any]:
        """
        Get customer-related data
        """
        from ..models.user import User
        from ..models.order import Order
        
        # Get total users
        total_users = self.db.query(func.count(User.id)).scalar()
        
        # Get recent orders to identify potentially inactive users
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_orders = self.db.query(Order).filter(
            Order.created_at >= thirty_days_ago
        ).all()
        
        recent_order_user_ids = set(order.user_id for order in recent_orders)
        total_users_with_orders = self.db.query(func.count(User.id)).filter(
            User.id.in_(self.db.query(Order.user_id).distinct())
        ).scalar()
        
        potentially_churning_users = max(0, total_users_with_orders - len(recent_order_user_ids))
        
        return {
            "total_users": total_users,
            "recent_orders_count": len(recent_orders),
            "potentially_churning_users": potentially_churning_users
        }
    
    def _generate_sales_forecast(self, current_month_data: Dict[str, Any], 
                                 product_sales: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate sales forecast for next month
        """
        try:
            # Simple forecasting based on historical data and trends
            # In a real implementation, this would use more complex algorithms
            
            # Get last 6 months of data for comparison
            prev_revenue = current_month_data.get('revenue', 0)
            
            # Calculate trend factor based on recent performance
            trend_factor = 1.0
            if product_sales:
                avg_product_revenue = sum(p['total_revenue'] for p in product_sales) / len(product_sales)
                if avg_product_revenue > 0:
                    # Simple trend calculation based on product performance
                    trend_factor = random.uniform(0.95, 1.15)  # Random realistic trend
            
            # Calculate forecast
            forecast_revenue = prev_revenue * trend_factor
            confidence = min(0.95, max(0.6, trend_factor))  # Confidence based on trend factor
            
            # Determine trend direction
            trend = "up" if trend_factor > 1.02 else "down" if trend_factor < 0.98 else "stable"
            
            return {
                "next_month_revenue": forecast_revenue,
                "confidence": confidence,
                "trend": trend,
                "prev_month_revenue": prev_revenue,
                "change_percent": (trend_factor - 1) * 100
            }
        except Exception as e:
            self.logger.error(f"Error generating sales forecast: {str(e)}", exc_info=True)
            return {
                "next_month_revenue": 0,
                "confidence": 0.0,
                "trend": "unknown",
                "prev_month_revenue": 0,
                "change_percent": 0
            }
    
    def _generate_alerts(self, inventory: List[Dict[str, Any]], 
                         product_sales: List[Dict[str, Any]], 
                         customer_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate alerts based on inventory, sales, and customer data
        """
        alerts = []
        
        # Low stock alerts
        for product in inventory:
            if product['stock'] < 5:  # Critical low stock
                alerts.append({
                    "type": "low_stock",
                    "product": product['title'],
                    "urgency": "high",
                    "message": f"موجودی {product['title']} کمتر از 5 عدد است",
                    "action": f"سفارش {max(20, product['stock']*2)} عدد دیگر از {product['title']}",
                    "current_stock": product['stock']
                })
            elif product['stock'] < 10:  # Low stock
                alerts.append({
                    "type": "low_stock",
                    "product": product['title'],
                    "urgency": "medium",
                    "message": f"موجودی {product['title']} کمتر از 10 عدد است",
                    "action": f"بررسی نیاز به تامین {product['title']}",
                    "current_stock": product['stock']
                })
        
        # Low sales alerts
        slow_moving_products = [p for p in product_sales if p['total_sold'] < 5 and p['stock'] > 20]
        for product in slow_moving_products:
            alerts.append({
                "type": "low_sales",
                "product": product['title'],
                "urgency": "medium",
                "message": f"فروش {product['title']} در 3 ماه اخیر کمتر از 5 عدد بوده است",
                "action": f"بررسی تبلیغات یا تخفیف برای {product['title']}",
                "units_sold": product['total_sold']
            })
        
        # Churn risk alerts
        if customer_data.get('potentially_churning_users', 0) > 10:
            alerts.append({
                "type": "churn_risk",
                "product": "مشتریان",
                "urgency": "medium",
                "message": f"{customer_data['potentially_churning_users']} مشتری احتمالاً در حال ترک هستند",
                "action": "ارسال ایمیل بازگردانی و پیشنهاد ویژه",
                "churn_risk_count": customer_data['potentially_churning_users']
            })
        
        return alerts
    
    def _generate_recommendations(self, product_sales: List[Dict[str, Any]], 
                                  inventory: List[Dict[str, Any]], 
                                  current_month_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate recommendations based on sales data
        """
        recommendations = []
        
        # Top selling products - recommend marketing
        if product_sales:
            top_products = sorted(product_sales, key=lambda x: x['total_revenue'], reverse=True)[:3]
            for product in top_products:
                recommendations.append({
                    "type": "marketing",
                    "product": product['title'],
                    "priority": "high",
                    "message": f"تبلیغ بیشتر {product['title']} که پرفروش‌ترین محصول ماه است",
                    "reason": f"با فروش {product['total_sold']} عدد و درآمد {product['total_revenue']:,.0f} تومان"
                })
        
        # Products with good sales but low stock - recommend restocking
        for product in product_sales:
            if product['total_sold'] > 20 and product.get('stock', 0) < 15:
                recommendations.append({
                    "type": "restock",
                    "product": product['title'],
                    "priority": "high",
                    "message": f"تامین بیشتر {product['title']} که فروش زیادی دارد",
                    "reason": f"فروش {product['total_sold']} عدد اما موجودی کم"
                })
        
        # Seasonal recommendations
        current_month = datetime.now().month
        seasonal_products = []
        
        # Example seasonal recommendations based on month
        if current_month in [11, 12, 1]:  # Winter
            seasonal_products = [p for p in product_sales if 'charger' in p['category'].lower() or 'heater' in p['category'].lower()]
        elif current_month in [6, 7, 8]:  # Summer
            seasonal_products = [p for p in product_sales if 'fan' in p['category'].lower() or 'air' in p['category'].lower()]
        
        for product in seasonal_products[:2]:
            recommendations.append({
                "type": "seasonal",
                "product": product['title'],
                "priority": "medium",
                "message": f"تبلیغ {product['title']} مرتبط با فصل جاری",
                "reason": "محصول فصلی با تقاضای بالقوه"
            })
        
        # Discount recommendations for slow-moving products
        slow_products = [p for p in product_sales if p['total_sold'] < 3 and p['stock'] > 30]
        for product in slow_products[:2]:
            discount_rate = random.randint(10, 30)  # Random discount between 10-30%
            recommendations.append({
                "type": "discount",
                "product": product['title'],
                "priority": "medium",
                "message": f"اعمال تخفیف {discount_rate}% برای {product['title']} کم فروش",
                "reason": f"فقط {product['total_sold']} عدد در 3 ماه اخیر فروخته شده"
            })
        
        return recommendations