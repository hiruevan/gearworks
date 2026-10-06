# This script runs the Gear Works server locally.

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
from pathlib import Path

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
