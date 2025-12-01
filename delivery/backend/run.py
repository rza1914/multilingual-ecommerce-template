import uvicorn
from seed_demo import seed_demo_data

if __name__ == "__main__":
    # Note: Demo seeding is done via separate command, not in the main run script
    # to avoid conflicts during normal server startup
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )