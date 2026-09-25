"""
TeachLens Backend Application Entry Point.
Runs on FastAPI with CORS support for local and cloud environments.
Initializes database schema and taxonomy seeds on startup.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.db import init_db
from backend.database.seed import seed_database
from backend.api.router import api_router

# Initialize tables & taxonomy seeds
init_db()
seed_database()

app = FastAPI(
    title="TeachLens AI Adaptive Learning Engine",
    description="Backend API powering learning gap diagnostics, mistake fingerprints, multi-subject taxonomy, peer squads, and comeback leaderboards.",
    version="2.0.0"
)

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "product": "TeachLens",
        "tagline": "See the Gap. Understand the Mistake. Master the Concept.",
        "status": "online",
        "version": "2.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
