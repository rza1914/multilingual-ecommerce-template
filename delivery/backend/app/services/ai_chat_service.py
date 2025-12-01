from typing import Any, Dict, List
import asyncio
import logging
import httpx
import json
import traceback
from sqlalchemy.orm import Session
from openai import APIError
from ..config import settings


class AIChatService:
    """
    Service class for handling AI chat interactions with DeepSeek API
    """

    def __init__(self, db: Session, user_id: int = None):
        """
        Initialize the AI chat service

        Args:
            db: Database session
            user_id: Current user's ID for context (optional for guest mode)
        """
        # Use the API key from configuration using the property that ensures loading from any .env file
        self.api_key = settings.deepseek_api_key
        self.base_url = settings.DEEPSEEK_BASE_URL
        self.db = db
        self.user_id = user_id
        self.model = settings.DEEPSEEK_MODEL

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

            # === ADD DEBUG LOGGING ===
            print("=== AI Service Call Debug (Non-Streaming) ===")
            print(f"Sending message to AI: '{user_message}'")
            print(f"API Key is configured: {'Yes' if settings.deepseek_api_key else 'No'}")
            print(f"Base URL: {settings.DEEPSEEK_BASE_URL}")
            print(f"Model: {settings.DEEPSEEK_MODEL}")
            # =========================

            # Build a system message with context
            system_message = self._build_system_message(context)

            # Prepare messages for the AI, ensuring proper encoding handling
            # More aggressive sanitization to ensure ASCII-safe content
            def sanitize_text_for_api(text):
                if not isinstance(text, str):
                    text = str(text)
                # First ensure UTF-8 encoding is clean
                text = text.encode('utf-8', errors='replace').decode('utf-8')
                # Then replace any remaining problematic characters
                import unicodedata
                text = unicodedata.normalize('NFKD', text)  # Normalize Unicode characters
                return text

            sanitized_system_message = sanitize_text_for_api(system_message)
            sanitized_user_message = sanitize_text_for_api(user_message)

            messages = [
                {
                    "role": "system",
                    "content": sanitized_system_message
                },
                {
                    "role": "user",
                    "content": sanitized_user_message
                }
            ]

            # === ADD DEBUG LOGGING FOR REQUEST ===
            print(f"Prepared messages for AI: {len(messages)} messages")
            # ====================================

            # DEBUG: Print the full payload to identify non-ASCII characters
            print(f"DEBUG: Full payload being sent to AI: {repr(messages)}")

            # Add this block right before the API call
            try:
                import json
                serialized_payload = json.dumps(messages, ensure_ascii=False)
                print("DEBUG: Manual serialization successful.")
            except UnicodeEncodeError as e:
                print(f"ERROR: Manual serialization failed: {e}")
                # Return an error response to the user
                return f"I'm having trouble processing your request due to a technical issue with character encoding. Please try again later. Error: {str(e)}"

            # Prepare the payload for the API
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 512,
                "top_p": 0.9,
                "stream": False
            }

            # Serialize the payload with UTF-8 encoding. THIS IS THE CRITICAL STEP.
            serialized_payload = json.dumps(payload, ensure_ascii=False)

            try:
                # Make a direct HTTP POST request to the API
                response = requests.post(
                    f"{self.base_url}/v1/chat/completions",
                    # Ensure all header values are ASCII-safe to prevent encoding errors
                    headers={
                        "Authorization": f"Bearer {self.api_key}".encode('ascii', errors='ignore').decode('ascii'),
                        "Content-Type": "application/json; charset=utf-8",
                        "User-Agent": "MyApp/1.0"  # Use a simple ASCII user agent
                    },
                    data=serialized_payload.encode('utf-8'),
                    stream=False,
                    timeout=60
                )

                response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

                # Parse the JSON response
                response_data = response.json()

                # Extract and return the response content
                response_content = response_data["choices"][0]["message"]["content"]

                if not response_content:
                    raise ValueError("Received empty response from AI model")

                # === ADD DEBUG LOGGING FOR SUCCESSFUL RESPONSE ===
                print("AI service responded successfully.")
                # ================================================

                return response_content

            except requests.exceptions.RequestException as e:
                # Handle network errors
                print(f"ERROR: API request failed: {e}")
                return self._get_fallback_response(user_message)
            except Exception as e:
                # Handle other potential errors
                print("ERROR: An unexpected error occurred. Full traceback:")
                traceback.print_exc()
                return self._get_fallback_response(user_message)

        except APIError as api_error:
            # === ADD DEBUG LOGGING FOR API ERROR ===
            print(f"ERROR: DeepSeek API error occurred (Non-Streaming).")
            print(f"Error Type: {type(api_error).__name__}")
            print(f"Error Details: {str(api_error)}")
            # =======================================
            self.logger.error(f"DeepSeek API error: {api_error}")
            return self._get_fallback_response(user_message)
        except ValueError as ve:
            print(f"ERROR: Validation error occurred (Non-Streaming).")
            print(f"Error Type: {type(ve).__name__}")
            print(f"Error Details: {str(ve)}")
            self.logger.error(f"Validation error: {ve}")
            return self._get_fallback_response(user_message)
        except Exception as e:
            # === ADD DEBUG LOGGING FOR ANY OTHER ERROR ===
            print(f"ERROR: Unexpected error occurred during AI service call (Non-Streaming).")
            print(f"Error Type: {type(e).__name__}")
            print(f"Error Details: {str(e)}")
            # ===============================================
            # Log the error with more details
            self.logger.error(f"Error calling DeepSeek API: {str(e)}", exc_info=True)
            # Return a fallback response
            return self._get_fallback_response(user_message)

    @staticmethod
    async def get_streaming_response(db: Session, user_message: str, context: Dict[str, Any], user_id: int = None):
        """
        Get a streaming response from the AI model based on user message and context

        Args:
            db: Database session
            user_message: The message from the user
            context: Context information (user info, products, orders, etc.)
            user_id: Current user's ID for context (optional for guest mode)

        Yields:
            str: AI-generated response chunks for streaming
        """
        try:
            # Validate inputs
            if not user_message or not user_message.strip():
                raise ValueError("User message cannot be empty")

            # === ADD DEBUG LOGGING ===
            print("=== AI Service Call Debug ===")
            print(f"Sending message to AI: '{user_message}'")
            print(f"API Key is configured: {'Yes' if settings.deepseek_api_key else 'No'}")
            print(f"Base URL: {settings.DEEPSEEK_BASE_URL}")
            print(f"Model: {settings.DEEPSEEK_MODEL}")
            # =========================

            # Use the property that ensures API key is loaded from any .env file
            api_key = settings.deepseek_api_key
            base_url = settings.DEEPSEEK_BASE_URL
            model = settings.DEEPSEEK_MODEL

            # Build a system message with context
            system_message = AIChatService._build_system_message_static(context)

            # Prepare messages for the AI, ensuring proper encoding handling
            # More aggressive sanitization to ensure ASCII-safe content
            def sanitize_text_for_api(text):
                if not isinstance(text, str):
                    text = str(text)
                # First ensure UTF-8 encoding is clean
                text = text.encode('utf-8', errors='replace').decode('utf-8')
                # Then replace any remaining problematic characters
                import unicodedata
                text = unicodedata.normalize('NFKD', text)  # Normalize Unicode characters
                return text

            sanitized_system_message = sanitize_text_for_api(system_message)
            sanitized_user_message = sanitize_text_for_api(user_message)

            messages = [
                {
                    "role": "system",
                    "content": sanitized_system_message
                },
                {
                    "role": "user",
                    "content": sanitized_user_message
                }
            ]

            # === ADD DEBUG LOGGING FOR REQUEST ===
            print(f"Prepared messages for AI: {len(messages)} messages")
            # ====================================

            # DEBUG: Print the full payload to identify non-ASCII characters
            print(f"DEBUG: Full payload being sent to AI: {repr(messages)}")

            # Add this block right before the API call
            try:
                import json
                serialized_payload = json.dumps(messages, ensure_ascii=False)
                print("DEBUG: Manual serialization successful.")
            except UnicodeEncodeError as e:
                print(f"ERROR: Manual serialization failed: {e}")
                # Return an error response to the user
                yield f"I'm having trouble processing your request due to a technical issue with character encoding. Please try again later. Error: {str(e)}"

            # Prepare the payload for the API
            payload = {
                "model": model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 512,
                "top_p": 0.9,
                "stream": True
            }

            # Serialize the payload with UTF-8 encoding. THIS IS THE CRITICAL STEP.
            serialized_payload = json.dumps(payload, ensure_ascii=False)

            try:
                import asyncio
                import requests
                from concurrent.futures import ThreadPoolExecutor
                import queue
                import threading

                # Create a queue to communicate between threads
                result_queue = queue.Queue()

                def streaming_worker():
                    try:
                        with requests.post(
                            f"{base_url}/v1/chat/completions",
                            # Ensure all header values are ASCII-safe to prevent encoding errors
                            headers={
                                "Authorization": f"Bearer {api_key}".encode('ascii', errors='ignore').decode('ascii'),
                                "Content-Type": "application/json; charset=utf-8",
                                "User-Agent": "MyApp/1.0"  # Use a simple ASCII user agent
                            },
                            data=serialized_payload.encode('utf-8'),
                            stream=True,
                            timeout=60
                        ) as response:
                            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

                            # === ADD DEBUG LOGGING FOR SUCCESSFUL RESPONSE ===
                            print("AI service responded successfully, starting to stream chunks...")
                            # ================================================

                            # Process the streaming response line by line
                            for line in response.iter_lines():
                                if line:
                                    # Decode the line from bytes to a string
                                    decoded_line = line.decode('utf-8')

                                    # SSE format starts with "data: "
                                    if decoded_line.startswith("data: "):
                                        data_str = decoded_line[6:]  # Remove the "data: " prefix

                                        if data_str == "[DONE]":
                                            result_queue.put(StopIteration)
                                            break

                                        try:
                                            import json
                                            # Parse the JSON data from the string
                                            json_data = json.loads(data_str)

                                            # Extract the content from the delta
                                            if "choices" in json_data and len(json_data["choices"]) > 0:
                                                content = json_data["choices"][0]["delta"].get("content", "")
                                                if content:
                                                    # Put the content in the queue
                                                    result_queue.put(content)
                                        except json.JSONDecodeError:
                                            # Ignore lines that are not valid JSON
                                            continue
                    except Exception as e:
                        # Put the exception in the queue if there's an error
                        result_queue.put(e)
                    finally:
                        # Signal that the stream is finished
                        result_queue.put(StopIteration)

                # Start the streaming worker in a separate thread
                executor = ThreadPoolExecutor(max_workers=1)
                try:
                    future = executor.submit(streaming_worker)

                    # Yield results as they come from the streaming worker
                    while True:
                        try:
                            # Get an item from the queue with a timeout to avoid blocking indefinitely
                            item = result_queue.get(timeout=1)

                            if item is StopIteration:
                                # End of stream
                                break
                            elif isinstance(item, Exception):
                                # Re-raise the exception
                                raise item
                            else:
                                # Yield the content
                                yield item
                        except queue.Empty:
                            # Check if the worker thread is done
                            if future.done():
                                # If the future is done and we get an empty queue, we're finished
                                break
                            continue
                finally:
                    # Ensure the executor is shut down
                    executor.shutdown(wait=False)

                # Signal that the stream is finished
                yield "[DONE]"

            except requests.exceptions.RequestException as e:
                # Handle network errors
                print(f"ERROR: API request failed: {e}")
                yield AIChatService._get_fallback_response_static(user_message)
            except Exception as e:
                # Handle other potential errors
                print("ERROR: An unexpected error occurred. Full traceback:")
                traceback.print_exc()
                yield AIChatService._get_fallback_response_static(user_message)

        except APIError as api_error:
            # === ADD DEBUG LOGGING FOR API ERROR ===
            print(f"ERROR: DeepSeek API error occurred.")
            print(f"Error Type: {type(api_error).__name__}")
            print(f"Error Details: {str(api_error)}")
            # =======================================
            logging.getLogger(__name__).error(f"DeepSeek API error: {api_error}")
            yield AIChatService._get_fallback_response_static(user_message)
        except ValueError as ve:
            print(f"ERROR: Validation error occurred.")
            print(f"Error Type: {type(ve).__name__}")
            print(f"Error Details: {str(ve)}")
            logging.getLogger(__name__).error(f"Validation error: {ve}")
            yield AIChatService._get_fallback_response_static(user_message)
        except Exception as e:
            # === ADD DEBUG LOGGING FOR ANY OTHER ERROR ===
            print(f"ERROR: Unexpected error occurred during AI service call.")
            print(f"Error Type: {type(e).__name__}")
            print(f"Error Details: {str(e)}")
            # ===============================================
            # Log the error with more details
            logging.getLogger(__name__).error(f"Error calling DeepSeek API: {str(e)}", exc_info=True)
            # Yield a fallback response
            yield AIChatService._get_fallback_response_static(user_message)

    @staticmethod
    def _build_system_message_static(context: Dict[str, Any]) -> str:
        """
        Static version of _build_system_message that can be used without instance
        """
        # Extract relevant information from context
        user_info = context.get("user_info", {})
        recent_orders = context.get("recent_orders", [])
        relevant_products = context.get("relevant_products", [])
        inventory_status = context.get("inventory_status", "unknown")

        # Handle case where user_info is None (for guest users)
        # Ensure proper encoding of all string values to handle Unicode characters
        user_id = str(user_info.get('id', 'Guest') or 'Guest') if user_info else 'Guest'
        username = str(user_info.get('username', 'Anonymous') or 'Anonymous') if user_info else 'Anonymous'
        full_name = str(user_info.get('full_name', 'Guest User') or 'Guest User') if user_info else 'Guest User'
        email = str(user_info.get('email', 'guest@example.com') or 'guest@example.com') if user_info else 'guest@example.com'

        system_prompt = f"""
        You are a helpful e-commerce assistant for a multilingual online store. Your role is to assist customers with their queries about products, orders, and general store information.

        Here is information about the current user:
        - User ID: {user_id}
        - Username: {username}
        - Full Name: {full_name}
        - Email: {email}

        Recent Orders:
        {AIChatService._format_orders_for_prompt_static(recent_orders)}

        Relevant Products:
        {AIChatService._format_products_for_prompt_static(relevant_products)}

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

    @staticmethod
    def _format_orders_for_prompt_static(orders: List[Dict[str, Any]]) -> str:
        """
        Static version of _format_orders_for_prompt that can be used without instance
        """
        if not orders:
            return "No recent orders found."

        formatted_orders = []
        for order in orders[:3]:  # Only include last 3 orders
            # Ensure proper encoding for all string values to handle Unicode characters
            order_id = str(order.get('id', 'N/A') or 'N/A')
            created_at = str(order.get('created_at', 'N/A') or 'N/A')
            status = str(order.get('status', 'N/A') or 'N/A')
            total = str(order.get('total', 'N/A') or 'N/A')

            formatted_orders.append(
                f"- Order ID: {order_id}, "
                f"Date: {created_at}, "
                f"Status: {status}, "
                f"Total: ${total}, "
                f"Items: {len(order.get('items', []))} products"
            )

        return "\n".join(formatted_orders)

    @staticmethod
    def _format_products_for_prompt_static(products: List[Dict[str, Any]]) -> str:
        """
        Static version of _format_products_for_prompt that can be used without instance
        """
        if not products:
            return "No relevant products found."

        formatted_products = []
        for product in products[:5]:  # Only include first 5 relevant products
            # Ensure proper encoding for all string values to handle Unicode characters
            title = str(product.get('title', 'N/A') or 'N/A')
            product_id = str(product.get('id', 'N/A') or 'N/A')
            price = str(product.get('price', 'N/A') or 'N/A')
            stock = str(product.get('stock', 'N/A') or 'N/A')
            category = str(product.get('category', 'N/A') or 'N/A')
            description = str(product.get('description', 'N/A') or 'N/A')

            status = "In stock" if (product.get('stock', 0) or 0) > 0 else "Out of stock"
            formatted_products.append(
                f"- Product: {title} "
                f"(ID: {product_id}), "
                f"Price: ${price}, "
                f"Stock: {stock} ({status}), "
                f"Category: {category}, "
                f"Description: {description[:100]}..."
            )

        return "\n".join(formatted_products)

    @staticmethod
    def _get_fallback_response_static(user_message: str) -> str:
        """
        Static version of _get_fallback_response that can be used without instance
        """
        # Simple keyword-based responses for common queries
        user_msg_lower = user_message.lower()

        if any(keyword in user_msg_lower for keyword in ["phone", "mobile", "گوشی", "سامسونگ", "iphone", "android"]):
            return "I can help you find products. Please check our product page or contact support."
        elif any(keyword in user_msg_lower for keyword in ["order", "سفارش", "last", "recent", "shipment", "deliver", "track"]):
            return "I can't access order details right now. Please check your account page or contact support."
        elif any(keyword in user_msg_lower for keyword in ["return", "refund", "exchange"]):
            return "For returns or refunds, please contact customer support or review our return policy."
        elif any(keyword in user_msg_lower for keyword in ["support", "help", "assist"]):
            return "Please state your question in more detail and I'll try to assist. You can also contact support directly."
        else:
            return "I'm having trouble processing your request. Please try rephrasing or contact support for assistance."
    
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
        
        # Handle case where user_info is None (for guest users)
        # Ensure proper encoding of all string values to handle Unicode characters
        user_id = str(user_info.get('id', 'N/A') or 'N/A') if user_info else 'N/A'
        username = str(user_info.get('username', 'N/A') or 'N/A') if user_info else 'N/A'
        full_name = str(user_info.get('full_name', 'N/A') or 'N/A') if user_info else 'N/A'
        email = str(user_info.get('email', 'N/A') or 'N/A') if user_info else 'N/A'

        system_prompt = f"""
        You are a helpful e-commerce assistant for a multilingual online store. Your role is to assist customers with their queries about products, orders, and general store information.

        Here is information about the current user:
        - User ID: {user_id}
        - Username: {username}
        - Full Name: {full_name}
        - Email: {email}

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
            return "I can help you find products. Please check our product page or contact support."
        elif any(keyword in user_msg_lower for keyword in ["order", "سفارش", "last", "recent", "shipment", "deliver", "track"]):
            return "I can't access order details right now. Please check your account page or contact support."
        elif any(keyword in user_msg_lower for keyword in ["return", "refund", "exchange"]):
            return "For returns or refunds, please contact customer support or review our return policy."
        elif any(keyword in user_msg_lower for keyword in ["support", "help", "assist"]):
            return "Please state your question in more detail and I'll try to assist. You can also contact support directly."
        else:
            return "I'm having trouble processing your request. Please try rephrasing or contact support for assistance."