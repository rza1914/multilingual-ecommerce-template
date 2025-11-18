#!/usr/bin/env python3
"""
Test script to verify WebSocket connection without token fails
"""
import asyncio
import websockets
import json
import sys

async def test_no_token():
    uri = "ws://localhost:8000/ws/chat/1"  # No token parameter
    
    print(f"Attempting to connect without token to: {uri}")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("[ERROR] Connection should have failed without token but was accepted!")
            return False
            
    except Exception as e:
        print(f"[INFO] Connection failed as expected without token: {e}")
        return True  # Connection should fail without required token parameter

if __name__ == "__main__":
    print("Testing WebSocket connection without token...")
    success = asyncio.run(test_no_token())
    
    if success:
        print("\n[RESULT] No token test PASSED! Connection properly rejected without token.")
        sys.exit(0)
    else:
        print("\n[RESULT] No token test FAILED! Connection should have failed without token.")
        sys.exit(1)