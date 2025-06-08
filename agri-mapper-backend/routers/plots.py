from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from database import SessionLocal
from models import Plot as PlotModel
from pydantic import BaseModel

router = APIRouter(prefix="/plots", tags=["Plots"])

# -----------------------------
# Database Dependency
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Pydantic Schema
# -----------------------------
class PlotCreate(BaseModel):
    id: int
    name: str
    coordinates: List[List[float]]

class PlotResponse(PlotCreate):
    class Config:
        orm_mode = True

# -----------------------------
# POST /plots
# -----------------------------
@router.post("/", response_model=PlotResponse)
def create_plot(plot: PlotCreate, db: Session = Depends(get_db)):
    # Check for duplicate ID
    existing = db.query(PlotModel).filter(PlotModel.id == plot.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Plot with this ID already exists.")

    plot_data = PlotModel(
        id=plot.id,
        name=plot.name,
        coordinates=json.dumps(plot.coordinates)  # Save as JSON string
    )

    db.add(plot_data)
    db.commit()
    db.refresh(plot_data)

    return PlotResponse(
        id=plot_data.id,
        name=plot_data.name,
        coordinates=json.loads(plot_data.coordinates)
    )

# -----------------------------
# GET /plots
# -----------------------------
@router.get("/", response_model=List[PlotResponse])
def get_all_plots(db: Session = Depends(get_db)):
    plots = db.query(PlotModel).all()
    return [
        PlotResponse(
            id=p.id,
            name=p.name,
            coordinates=json.loads(p.coordinates)
        )
        for p in plots
    ]
