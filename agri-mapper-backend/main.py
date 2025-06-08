from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import plots
from database import Base, engine
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
import os
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import base64
import uuid
# app = FastAPI()

# Base.metadata.create_all(bind=engine)

# # Allow frontend at localhost:3000
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # or ["*"] for all
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # Include routes
# app.include_router(plots.router)

# @app.get("/")
# def root():
#     return {"message": "Agri Mapper Backend Running"}


app = FastAPI()

Base.metadata.create_all(bind=engine)

# # Allow frontend at localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Define request schema
class PolygonData(BaseModel):
    name: str
    polygon: List[List[float]]
    signature: str

# Save uploads here
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/submit")
async def submit_data(data: PolygonData):
    if len(data.polygon) < 3:
        raise HTTPException(status_code=400, detail="Polygon must have at least 3 points.")

    # Save polygon data to a file
    polygon_id = str(uuid.uuid4())
    with open(os.path.join(UPLOAD_DIR, f"{polygon_id}_polygon.json"), "w") as f:
        import json
        json.dump({
            "name": data.name,
            "polygon": data.polygon,
        }, f)

    # Save the base64 signature image
    if data.signature.startswith("data:image"):
        signature_data = data.signature.split(",")[1]
        image_bytes = base64.b64decode(signature_data)
        with open(os.path.join(UPLOAD_DIR, f"{polygon_id}_signature.png"), "wb") as img_file:
            img_file.write(image_bytes)

    return {"status": "success", "id": polygon_id}



@app.get("/api/submissions")
async def get_submissions():
    records = []
    for filename in os.listdir(UPLOAD_DIR):
        if filename.endswith("_polygon.json"):
            polygon_id = filename.replace("_polygon.json", "")
            with open(os.path.join(UPLOAD_DIR, filename), "r") as f:
                data = json.load(f)

            sig_path = os.path.join(UPLOAD_DIR, f"{polygon_id}_signature.png")
            if os.path.exists(sig_path):
                signature_url = f"http://localhost:8000/api/signature/{polygon_id}_signature.png"
            else:
                signature_url = None
            print(f", Signature URL: {signature_url}")
            records.append({
                "id": polygon_id,
                "name": data.get("name"),
                "polygon": data.get("polygon"),
                "signature_url": signature_url
            })

    return JSONResponse(content=records)

@app.get("/api/signature/{polygon_id}")
async def get_signature(polygon_id: str):
    path = os.path.join(UPLOAD_DIR, f"{polygon_id}")
    print(f"Looking for signature at: {path}")
    if os.path.exists(path):
        return FileResponse(path, media_type='image/png')
    raise HTTPException(status_code=404, detail="Signature not found")