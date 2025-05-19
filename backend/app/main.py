from fastapi import FastAPI
from app.models.message import Base
from app.database import engine
from app.routes import message

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(message.router)

@app.get("/")
def read_root():
    return {"message": "anon_chat backend is running* ??? !!"}