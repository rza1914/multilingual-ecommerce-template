from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from .config import settings
from .database import engine, Base
from .api.v1 import api_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multilingual E-commerce Template",
    description="A modern, clean, and classy e-commerce template with multilingual support",
    version="1.0.0",
)

# Set up CORS - Must be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "User-Agent",
        "DNT",
        "Cache-Control",
        "X-Requested-With",
    ],
    expose_headers=["*"],
    max_age=3600,
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <html>
        <head>
            <title>Multilingual E-commerce Template</title>
        </head>
        <body>
            <h1>Welcome to Multilingual E-commerce Template API</h1>
            <p>Visit <a href="/docs">/docs</a> for API documentation.</p>
        </body>
    </html>
    """

@app.get("/health")
async def health_check():
    return {"status": "healthy"}