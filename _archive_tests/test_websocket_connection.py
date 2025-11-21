#!/usr/bin/env python3
"""
Test script to verify WebSocket connection to FastAPI backend
"""
import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    uri = "ws://localhost:8000/ws/chat/1?token=test"

    print(f"Attempting to connect to: {uri}")

    try:
        async with websockets.connect(uri) as websocket:
            print("[SUCCESS] WebSocket connected successfully!")

            # Wait for welcome message
            welcome_msg = await websocket.recv()
            print(f"[RECEIVED] Received: {welcome_msg}")

            # Send a test message
            test_message = {
                "type": "chat_message",
                "content": "Hello from test script!",
                "sender": "user",
                "timestamp": "2025-11-17T00:00:00Z"
            }

            await websocket.send(json.dumps(test_message))
            print(f"[SENT] Sent: {test_message}")

            # Wait for response
            response = await websocket.recv()
            print(f"[RECEIVED] Received: {response}")

            print("[SUCCESS] WebSocket communication successful!")
            return True

    except websockets.exceptions.ConnectionClosedError as e:
        print(f"[ERROR] Connection closed with error: {e.code} - {e.reason}")
        return False
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"[ERROR] Invalid status code: {e.status_code}")
        return False
    except Exception as e:
        print(f"[ERROR] Error connecting to WebSocket: {e}")
        return False

if __name__ == "__main__":
    print("Testing WebSocket connection...")
    success = asyncio.run(test_websocket_connection())

    if success:
        print("\n[RESULT] WebSocket connection test PASSED!")
        sys.exit(0)
    else:
        print("\n[RESULT] WebSocket connection test FAILED!")
        sys.exit(1)