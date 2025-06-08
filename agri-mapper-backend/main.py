from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import plots
from database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

# Allow frontend at localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
app.include_router(plots.router)

@app.get("/")
def root():
    return {"message": "Agri Mapper Backend Running"}
