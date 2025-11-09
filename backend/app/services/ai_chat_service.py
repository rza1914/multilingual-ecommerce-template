from typing import Any, Dict, List
import asyncio
import logging
from sqlalchemy.orm import Session
from groq import AsyncGroq, APIError
from ..config import settings


class AIChatService:
    """
    Service class for handling AI chat interactions with Groq API
    """
    
    def __init__(self, db: Session, user_id: int):
        """
        Initialize the AI chat service
        
        Args:
            db: Database session
            user_id: Current user's ID for context
        """
        # Use the API key from configuration
        api_key = settings.GROQ_API_KEY
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in configuration")
        self.client = AsyncGroq(api_key=api_key)
        self.db = db
        self.user_id = user_id
        
        # Setup logging
        self.logger = logging.getLogger(__name__)
        
    async def get_chat_response(self, user_message: str, context: Dict[str, Any]) -> str:
        """
        Get a response from the AI model based on user message and context
        
        Args:
            user_message: The message from the user
            context: Context information (user info, products, orders, etc.)
        
        Returns:
            str: AI-generated response
        """
        try:
            # Validate inputs
            if not user_message or not user_message.strip():
                raise ValueError("User message cannot be empty")
            
            # Build a system message with context
            system_message = self._build_system_message(context)
            
            # Prepare messages for the AI
            messages = [
                {
                    "role": "system",
                    "content": system_message
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
            
            # Call the Groq API
            chat_completion = await self.client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",  # Using LLaMA 3 model
                temperature=0.7,
                max_tokens=512,
                top_p=0.9,
                stream=False
            )
            
            # Extract and return the response
            response = chat_completion.choices[0].message.content
            
            if not response:
                raise ValueError("Received empty response from AI model")
                
            return response
            
        except APIError as api_error:
            self.logger.error(f"Groq API error: {api_error}")
            return self._get_fallback_response(user_message)
        except ValueError as ve:
            self.logger.error(f"Validation error: {ve}")
            return self._get_fallback_response(user_message)
        except Exception as e:
            # Log the error with more details
            self.logger.error(f"Error calling Groq API: {str(e)}", exc_info=True)
            # Return a fallback response
            return self._get_fallback_response(user_message)
    
    def _build_system_message(self, context: Dict[str, Any]) -> str:
        """
        Build the system message that provides context to the AI
        
        Args:
            context: Context information
            
        Returns:
            str: Formatted system message
        """
        # Extract relevant information from context
        user_info = context.get("user_info", {})
        recent_orders = context.get("recent_orders", [])
        relevant_products = context.get("relevant_products", [])
        inventory_status = context.get("inventory_status", "unknown")
        
        system_prompt = f"""
        You are a helpful e-commerce assistant for a multilingual online store. Your role is to assist customers with their queries about products, orders, and general store information.
        
        Here is information about the current user:
        - User ID: {user_info.get('id', 'N/A')}
        - Username: {user_info.get('username', 'N/A')}
        - Full Name: {user_info.get('full_name', 'N/A')}
        - Email: {user_info.get('email', 'N/A')}
        
        Recent Orders:
        {self._format_orders_for_prompt(recent_orders)}
        
        Relevant Products:
        {self._format_products_for_prompt(relevant_products)}
        
        Inventory Status: {inventory_status}
        
        Instructions:
        1. Respond in Persian (Farsi) if the user speaks Persian, otherwise in English
        2. Answer questions about products based on the product information provided
        3. Provide information about the user's orders if asked
        4. Be helpful but stay within the boundaries of the provided information
        5. If you don't have specific information, politely say you don't know and suggest alternatives
        6. Only recommend actual products from the provided list
        7. Be friendly and professional
        8. If product is out of stock, clearly mention this
        9. For shipping/order questions, provide accurate information based on order data
        """
        
        return system_prompt
    
    def _format_orders_for_prompt(self, orders: List[Dict[str, Any]]) -> str:
        """
        Format order information for the AI prompt
        
        Args:
            orders: List of order information
            
        Returns:
            str: Formatted orders string
        """
        if not orders:
            return "No recent orders found."
        
        formatted_orders = []
        for order in orders[:3]:  # Only include last 3 orders
            formatted_orders.append(
                f"- Order ID: {order.get('id', 'N/A')}, "
                f"Date: {order.get('created_at', 'N/A')}, "
                f"Status: {order.get('status', 'N/A')}, "
                f"Total: ${order.get('total', 'N/A')}, "
                f"Items: {len(order.get('items', []))} products"
            )
        
        return "\n".join(formatted_orders)
    
    def _format_products_for_prompt(self, products: List[Dict[str, Any]]) -> str:
        """
        Format product information for the AI prompt
        
        Args:
            products: List of product information
            
        Returns:
            str: Formatted products string
        """
        if not products:
            return "No relevant products found."
        
        formatted_products = []
        for product in products[:5]:  # Only include first 5 relevant products
            status = "In stock" if product.get('stock', 0) > 0 else "Out of stock"
            formatted_products.append(
                f"- Product: {product.get('title', 'N/A')} "
                f"(ID: {product.get('id', 'N/A')}), "
                f"Price: ${product.get('price', 'N/A')}, "
                f"Stock: {product.get('stock', 'N/A')} ({status}), "
                f"Category: {product.get('category', 'N/A')}, "
                f"Description: {product.get('description', 'N/A')[:100]}..."
            )
        
        return "\n".join(formatted_products)
    
    def _get_fallback_response(self, user_message: str) -> str:
        """
        Generate a fallback response when the AI service fails
        
        Args:
            user_message: Original user message
            
        Returns:
            str: Fallback response
        """
        # Simple keyword-based responses for common queries
        user_msg_lower = user_message.lower()
        
        if any(keyword in user_msg_lower for keyword in ["phone", "mobile", "گوشی", "سامسونگ", "iphone", "android"]):
            return "متاسفانه در حال حاضر نمی‌توانم اطلاعات محصول را بازیابی کنم. لطفاً صفحه محصولات ما را بررسی کنید یا با پشتیبانی تماس بگیرید."
        elif any(keyword in user_msg_lower for keyword in ["order", "سفارش", "last", "recent", "shipment", "deliver", "track"]):
            return "متاسفانه در حال حاضر نمی‌توانم اطلاعات سفارش را بازیابی کنم. لطفاً صفحه حساب کاربری خود را بررسی کنید یا با پشتیبانی تماس بگیرید."
        elif any(keyword in user_msg_lower for keyword in ["return", "refund", "exchange"]):
            return "برای درخواست مرجوعی یا بازپرداخت، لطفاً با بخش پشتیبانی مشتریان تماس بگیرید یا سیاست مرجوعی ما را در صفحه مربوطه مطالعه کنید."
        elif any(keyword in user_msg_lower for keyword in ["support", "help", "assist"]):
            return "لطفاً سوال خود را با جزئیات بیشتری بیان کنید تا بتوانم بهتر کمک کنم. در غیر این صورت، می‌توانید با پشتیبانی تماس بگیرید."
        else:
            return "متاسفانه در حال حاضر نمی‌توانم به سوال شما پاسخ دهیم. لطفاً سوال خود را واضح‌تر مطرح کنید یا با پشتیبانی تماس بگیرید."