# backend/app/api/websocket_manager.py
from typing import Dict, List
from fastapi import WebSocket
import logging

class ConnectionManager:
    def __init__(self):
        # دیکشنری برای نگهداری اتصال‌ها بر اساس chat_id
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, chat_id: str):
        """
        اتصال WebSocket به مدیر
        """
        # این خط رو حذف کردیم چون در router انجام میشه: await websocket.accept()
        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = []

        # چک کن که قبلاً اضافه نشده
        if websocket not in self.active_connections[chat_id]:
            self.active_connections[chat_id].append(websocket)

        logging.info(f"✅ WebSocket connected for chat {chat_id}, total connections: {len(self.active_connections[chat_id])}")

    def disconnect(self, websocket: WebSocket, chat_id: str):
        """
        قطع اتصال WebSocket از مدیر
        """
        if chat_id in self.active_connections:
            try:
                if websocket in self.active_connections[chat_id]:
                    self.active_connections[chat_id].remove(websocket)
                if not self.active_connections[chat_id]:
                    del self.active_connections[chat_id]
            except ValueError:
                # WebSocket already removed, ignore
                logging.warning(f"⚠️ WebSocket not found in active connections for chat {chat_id}")
        logging.info(f"🔴 WebSocket disconnected for chat {chat_id}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """
        ارسال پیام مستقیم به یک اتصال WebSocket خاص
        """
        try:
            # چک می‌کنیم آیا اتصال هنوز بازه یا نه
            if websocket.client_state.name == 'CONNECTED':
                await websocket.send_text(message)
                logging.info(f"📤 Sent personal message to WebSocket: {message}")
            else:
                logging.warning(f"⚠️ Cannot send message, WebSocket state is {websocket.client_state.name}")
        except Exception as e:
            logging.error(f"❌ Error sending personal message to WebSocket: {e}")
            # فقط لاگ می‌کنیم، ارور نمی‌اندازیم

    async def broadcast_to_chat(self, message: str, chat_id: str):
        """
        ارسال پیام به همه اتصال‌های یک چت
        """
        if chat_id in self.active_connections:
            disconnected_websockets = []
            for connection in self.active_connections[chat_id]:
                try:
                    await connection.send_text(message)
                except Exception as e:
                    logging.error(f"❌ Error sending message to chat {chat_id}: {e}")
                    disconnected_websockets.append(connection)

            # حذف اتصال‌های ناموفق
            for connection in disconnected_websockets:
                self.disconnect(connection, chat_id)

# ایجاد یک نمونه از مدیر اتصال
manager = ConnectionManager()