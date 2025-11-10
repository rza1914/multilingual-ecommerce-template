"""
WebSocket endpoints for real-time inventory updates in iShop E-commerce Platform
"""

from typing import Optional
import json
import logging
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketException, Depends, Query
from sqlalchemy.orm import Session

from ...core.auth import get_current_user
from ...models.user import User
from ...models.product import Product
from .websocket_manager import manager
from ...database import SessionLocal

router = APIRouter()
logger = logging.getLogger(__name__)


@router.websocket("/inventory")
async def websocket_inventory_updates(
    websocket: WebSocket,
    token: str = Query(...)
):
    """
    WebSocket endpoint for real-time inventory updates
    Clients connect with a valid auth token to receive inventory change notifications
    """
    current_user: User = None

    try:
        # Get a database session manually since WebSocket doesn't use Depends
        db = SessionLocal()
        
        try:
            # Validate the token and get the current user
            # We need to manually decode the JWT token since WebSocket doesn't use Depends
            from jose import jwt, JWTError
            from ...config import settings

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                user_id: str = payload.get("sub")
                if user_id is None:
                    await websocket.close(code=1008, reason="Invalid authentication token")
                    return
            except JWTError:
                await websocket.close(code=1008, reason="Invalid authentication token")
                return

            current_user = db.query(User).filter(User.id == user_id).first()
            if not current_user or not current_user.is_active:
                await websocket.close(code=1008, reason="Invalid or inactive user")
                return

            # Connect the user to the WebSocket manager
            await manager.connect(websocket, str(current_user.id))

            try:
                # Send welcome message
                welcome_msg = {
                    "type": "welcome",
                    "message": "Connected to inventory update service",
                    "timestamp": datetime.utcnow().isoformat()
                }
                await manager.send_personal_message(json.dumps(welcome_msg), websocket)

                # Main message loop
                while True:
                    # Receive messages from client (for ping/pong or other interactions)
                    try:
                        data = await websocket.receive_text()
                        message = json.loads(data)

                        # Handle ping/pong for heartbeat
                        if message.get("type") == "ping":
                            pong_response = {
                                "type": "pong",
                                "timestamp": datetime.utcnow().isoformat()
                            }
                            await manager.send_personal_message(json.dumps(pong_response), websocket)
                            manager.update_heartbeat(websocket)

                    except json.JSONDecodeError:
                        # If not valid JSON, ignore or send error
                        continue
                    except WebSocketDisconnect:
                        break
            except WebSocketDisconnect:
                pass
            finally:
                # Always disconnect from manager when done
                manager.disconnect(websocket)
        finally:
            # Always close the database session
            db.close()

    except WebSocketException as e:
        logger.error(f"WebSocket exception for user {current_user.id if current_user else 'unknown'}: {e}")
        if websocket.client_state != websocket.application_state.DISCONNECTED:
            await websocket.close(code=e.code, reason=e.reason)
    except Exception as e:
        logger.error(f"Unexpected error in inventory WebSocket for user {current_user.id if current_user else 'unknown'}: {e}")
        if websocket.client_state != websocket.application_state.DISCONNECTED:
            await websocket.close(code=1011, reason="Internal server error")


@router.websocket("/chat/{user_id}")
async def websocket_chat(
    websocket: WebSocket,
    user_id: str,
    token: str = Query(...)
):
    """
    WebSocket endpoint for chat functionality
    This endpoint enhances the existing chat functionality with proper WebSocket implementation
    """
    current_user: User = None

    try:
        # Get a database session manually since WebSocket doesn't use Depends
        db = SessionLocal()
        
        try:
            # Validate the token and get the current user
            # We need to manually decode the JWT token since WebSocket doesn't use Depends
            from jose import jwt, JWTError
            from ...config import settings

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                token_user_id: str = payload.get("sub")
                if token_user_id is None:
                    await websocket.close(code=1008, reason="Invalid authentication token")
                    return
            except JWTError:
                await websocket.close(code=1008, reason="Invalid authentication token")
                return

            current_user = db.query(User).filter(User.id == token_user_id).first()
            if not current_user or not current_user.is_active or str(current_user.id) != user_id:
                await websocket.close(code=1008, reason="Invalid authentication or user mismatch")
                return

            # Connect the user to the WebSocket manager
            await manager.connect(websocket, user_id)

            try:
                # Send welcome message
                welcome_msg = {
                    "type": "welcome",
                    "message": f"Connected to chat for user {user_id}",
                    "timestamp": datetime.utcnow().isoformat()
                }
                await manager.send_personal_message(json.dumps(welcome_msg), websocket)

                # Main message loop
                while True:
                    try:
                        data = await websocket.receive_text()
                        message = json.loads(data)

                        # Handle ping/pong for heartbeat
                        if message.get("type") == "ping":
                            pong_response = {
                                "type": "pong",
                                "timestamp": datetime.utcnow().isoformat()
                            }
                            await manager.send_personal_message(json.dumps(pong_response), websocket)
                            manager.update_heartbeat(websocket)
                        else:
                            # Process chat message
                            processed_msg = {
                                "type": "chat_message",
                                "content": message.get("content", ""),
                                "sender": user_id,
                                "timestamp": datetime.utcnow().isoformat()
                            }
                            # For now, echo back to sender - in real implementation, process through chat service
                            await manager.send_personal_message(json.dumps(processed_msg), websocket)

                    except json.JSONDecodeError:
                        continue
                    except WebSocketDisconnect:
                        break
            except WebSocketDisconnect:
                pass
        finally:
            # Always close the database session
            db.close()

    except WebSocketException as e:
        logger.error(f"WebSocket exception for chat user {user_id}: {e}")
        if websocket.client_state != websocket.application_state.DISCONNECTED:
            await websocket.close(code=e.code, reason=e.reason)
    except Exception as e:
        logger.error(f"Unexpected error in chat WebSocket for user {user_id}: {e}")
        if websocket.client_state != websocket.application_state.DISCONNECTED:
            await websocket.close(code=1011, reason="Internal server error")


# Additional utility endpoints
@router.get("/stats")
async def get_websocket_stats():
    """Get statistics about active WebSocket connections"""
    return manager.get_connection_info()


from ...database import get_db

@router.post("/broadcast-inventory")
async def broadcast_inventory_update(
    product_id: int,
    new_stock: int,
    change_type: str,
    product_name: str,
    db: Session = Depends(get_db)
):
    """
    API endpoint to broadcast inventory updates to all connected clients
    This can be called from other parts of the application when inventory changes
    """
    try:
        # Get product info for the update
        product = db.query(Product).filter(Product.id == product_id).first()

        # Prepare the inventory update message
        update_message = {
            "type": "inventory_update",
            "productId": product_id,
            "productName": product_name if product_name else (product.name if product else "Unknown Product"),
            "newStock": new_stock,
            "changeType": change_type,
            "timestamp": datetime.utcnow().isoformat()
        }

        # Broadcast to all connected clients
        await manager.broadcast_to_all(json.dumps(update_message))

        logger.info(f"Broadcast inventory update for product {product_id}: {change_type}, new stock: {new_stock}")

        return {
            "success": True,
            "message": f"Inventory update broadcast for product {product_id}",
            "connections_affected": manager.get_connection_count()
        }

    except Exception as e:
        logger.error(f"Error broadcasting inventory update: {e}")
        return {
            "success": False,
            "message": "Failed to broadcast inventory update",
            "error": str(e)
        }