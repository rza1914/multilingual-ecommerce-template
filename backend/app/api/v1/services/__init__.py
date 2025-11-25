"""
Services API endpoints
"""
from fastapi import APIRouter
from . import conversation_sse

services_router = APIRouter()
services_router.include_router(conversation_sse.router, prefix="/services", tags=["services"])