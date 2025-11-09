#!/usr/bin/env python3
"""
Script to manage Telegram Bot API keys
"""
import sys
import argparse
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.api.v1.bot_integration.service import create_bot_api_key


def create_key(name: str, permissions: str = "read"):
    """
    Create a new bot API key
    """
    db = SessionLocal()
    try:
        bot_key = create_bot_api_key(db, name, permissions)
        print("Bot API Key created successfully!")
        print(f"Name: {bot_key.name}")
        print(f"API Key: {bot_key.api_key}")
        print(f"Permissions: {bot_key.permissions}")
        print(f"ID: {bot_key.id}")
        print("\nIMPORTANT: Save this API key securely as it will not be shown again.")
    except Exception as e:
        print(f"Error creating API key: {e}")
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Manage Telegram Bot API keys")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Create key parser
    create_parser = subparsers.add_parser("create", help="Create a new bot API key")
    create_parser.add_argument("name", type=str, help="Name for the bot API key")
    create_parser.add_argument("--permissions", type=str, default="read:customers,read:products,read:orders",
                              help="Comma-separated permissions (default: 'read:customers,read:products,read:orders')")
    
    args = parser.parse_args()
    
    if args.command == "create":
        create_key(args.name, args.permissions)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()