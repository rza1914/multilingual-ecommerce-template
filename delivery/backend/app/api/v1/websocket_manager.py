"""
WebSocket Connection Manager for iShop E-commerce Platform
Handles multiple WebSocket connections for real-time inventory updates
"""

import json
import logging
from typing import Dict, List, Optional
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        # Store active connections with additional metadata
        self.active_connections: Dict[WebSocket, Dict] = {}
        # Store connections by user ID for targeted messaging
        self.connections_by_user: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        
        # Store connection with metadata
        connection_metadata = {
            "connected_at": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "last_heartbeat": datetime.utcnow().isoformat()
        }
        
        self.active_connections[websocket] = connection_metadata
        
        # Add to user-specific connections list
        if user_id not in self.connections_by_user:
            self.connections_by_user[user_id] = []
        self.connections_by_user[user_id].append(websocket)
        
        logger.info(f"New WebSocket connection established for user {user_id}. Total connections: {len(self.active_connections)}")
        
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection and clean up references"""
        if websocket in self.active_connections:
            user_id = self.active_connections[websocket]["user_id"]
            
            # Remove from main connections dict
            del self.active_connections[websocket]
            
            # Remove from user-specific list
            if user_id in self.connections_by_user:
                if websocket in self.connections_by_user[user_id]:
                    self.connections_by_user[user_id].remove(websocket)
                    # Clean up empty lists
                    if not self.connections_by_user[user_id]:
                        del self.connections_by_user[user_id]
            
            logger.info(f"WebSocket connection closed for user {user_id}. Remaining connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket connection"""
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending message to WebSocket: {e}")
            self.disconnect(websocket)
    
    async def broadcast_to_user(self, user_id: str, message: str):
        """Send a message to all connections for a specific user"""
        if user_id in self.connections_by_user:
            connections_to_remove = []
            
            for websocket in self.connections_by_user[user_id]:
                try:
                    if websocket.application_state == WebSocketState.CONNECTED:
                        await websocket.send_text(message)
                    else:
                        connections_to_remove.append(websocket)
                except Exception as e:
                    logger.error(f"Error sending message to user {user_id}: {e}")
                    connections_to_remove.append(websocket)
            
            # Clean up disconnected connections
            for websocket in connections_to_remove:
                self.disconnect(websocket)
    
    async def broadcast_to_all(self, message: str):
        """Send a message to all active WebSocket connections"""
        connections_to_remove = []
        
        for websocket in list(self.active_connections.keys()):
            try:
                if websocket.application_state == WebSocketState.CONNECTED:
                    await websocket.send_text(message)
                else:
                    connections_to_remove.append(websocket)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                connections_to_remove.append(websocket)
        
        # Clean up disconnected connections
        for websocket in connections_to_remove:
            self.disconnect(websocket)
    
    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self.active_connections)
    
    def get_user_connection_count(self, user_id: str) -> int:
        """Get the number of connections for a specific user"""
        return len(self.connections_by_user.get(user_id, []))
    
    def update_heartbeat(self, websocket: WebSocket):
        """Update the heartbeat timestamp for a connection"""
        if websocket in self.active_connections:
            self.active_connections[websocket]["last_heartbeat"] = datetime.utcnow().isoformat()
    
    def get_connection_info(self) -> Dict:
        """Get detailed information about all connections"""
        return {
            "total_connections": len(self.active_connections),
            "unique_users": len(self.connections_by_user),
            "connections": {
                str(conn): metadata 
                for conn, metadata in self.active_connections.items()
            }
        }


# Global connection manager instance
manager = ConnectionManager()