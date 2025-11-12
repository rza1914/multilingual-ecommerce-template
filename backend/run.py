import uvicorn
import os
from seed_demo import seed_demo_data

if __name__ == "__main__":
    # Check if we're in demo mode and need to seed data
    if os.getenv("DEMO_MODE") == "1":
        print("Running in demo mode - seeding demo data...")
        seed_demo_data()
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )