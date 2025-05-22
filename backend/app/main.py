from fastapi import FastAPI
from app.models.message import Base
from app.database import engine
from app.routes import message
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(message.router)

@app.get("/")
def read_root():
    return {"message": "anon_chat backend is running* ??? !!"}