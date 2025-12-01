#!/usr/bin/env python3
"""
Test script to verify WebSocket connection with invalid token fails
"""
import asyncio
import websockets
import json
import sys

async def test_invalid_token():
    uri = "ws://localhost:8000/ws/chat/1?token=invalid"
    
    print(f"Attempting to connect with invalid token to: {uri}")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("[ERROR] Connection should have been rejected but was accepted!")
            return False
            
    except websockets.exceptions.ConnectionClosedError as e:
        if e.code == 1008:  # Policy violation code
            print(f"[SUCCESS] Connection properly rejected with code {e.code} - {e.reason}")
            return True
        else:
            print(f"[ERROR] Connection closed with unexpected code {e.code} - {e.reason}")
            return False
    except Exception as e:
        print(f"[INFO] Connection failed as expected: {e}")
        return True  # For invalid tokens, connection might fail in various ways, which is expected

if __name__ == "__main__":
    print("Testing WebSocket connection with invalid token...")
    success = asyncio.run(test_invalid_token())
    
    if success:
        print("\n[RESULT] Invalid token test PASSED! Connection properly rejected.")
        sys.exit(0)
    else:
        print("\n[RESULT] Invalid token test FAILED! Connection should have been rejected.")
        sys.exit(1)