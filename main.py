# This script runs the Gear Works server locally.

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uvicorn
import socket

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

def get_local_ip():
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except Exception:
        return "127.0.0.1"

@app.get("/{path:path}")
async def catch_all(path: str):
    if not path:
        file_path = BASE_DIR / "index.html"
        if file_path.is_file():
            return FileResponse(file_path)

    requested_path = BASE_DIR / path

    if requested_path.is_file():
        return FileResponse(requested_path)

    if "." not in Path(path).name:
        html_path = BASE_DIR / f"{path}.html"

        if html_path.is_file():
            return FileResponse(html_path)

    return {"detail": "Not Found"}


app.mount("/", StaticFiles(directory=BASE_DIR), name="static")

if __name__ == "__main__":
    ip = get_local_ip()

    print("\nServer running at:")
    print("  Local:   http://127.0.0.1:8000")
    print(f"  Network: http://{ip}:8000")

    print("\nPress CTRL+C to stop the server.\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )

