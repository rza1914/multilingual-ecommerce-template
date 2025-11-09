from fastapi import APIRouter
from . import auth, users, products, orders, admin, seed, chat, smart_search, cart
from .bot_integration.bot_api import bot_api_router

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(seed.router, prefix="/seed", tags=["seed"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(smart_search.router, prefix="/products", tags=["smart-search"])
api_router.include_router(cart.router, tags=["cart"])
api_router.include_router(bot_api_router)