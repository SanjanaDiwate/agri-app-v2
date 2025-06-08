from sqlalchemy import Column, Integer, String, Text
from database import Base
import json

class Plot(Base):
    __tablename__ = "plots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    coordinates = Column(Text, nullable=False)  # store as JSON string
