from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path  # Add this import
from .config import settings
from .database import engine, Base
from .models import user, product, order, bot  # Import models to register them with SQLAlchemy
from .api.v1 import api_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multilingual E-commerce Template",
    description="A modern, clean, and classy e-commerce template with multilingual support",
    version="1.0.0",
)


@app.on_event("startup")
def startup_event():
    # Import and run the admin creation function directly
    import sys
    import os
    from pathlib import Path
    
    # Add backend directory to Python path
    backend_dir = Path(__file__).parent.parent.parent
    sys.path.insert(0, str(backend_dir))
    
    try:
        from create_or_verify_admin import create_or_verify_admin
        create_or_verify_admin()
    except ImportError:
        print("Could not import create_or_verify_admin.py. Make sure the file exists in the backend directory.")
    except Exception as e:
        print(f"Error running admin creation: {e}")

# Set up CORS - Must be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://multilingual-ecommerce-template-ohimnpkxr.vercel.app",
        "https://multilingual-ecommerce-template-j0yyw6oms.vercel.app",  # URL قدیمی
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Serve static files (only if directory exists)
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

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