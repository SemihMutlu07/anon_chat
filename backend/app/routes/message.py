from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageOut
from app.utils.encryption import encrypt_message, decrypt_message   
from typing import List
from collections import defaultdict
import time
import uuid

router = APIRouter()

last_sent_by_alias = defaultdict(float)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/messages/")
def create_message(data: MessageCreate, db: Session = Depends(get_db)):
    now = time.time()
    last_sent = last_sent_by_alias[data.alias]
    
    if now - last_sent < 10:
        raise HTTPException(status_code=429, detail="You are sending messages too quickly. Please wait a moment.")
    
    last_sent_by_alias[data.alias] = now
    
    expires_at = None
    if data.expires_in_minutes:
        expires_at = datetime.utcnow() + timedelta(minutes=data.expires_in_minutes)
        
    encrypted_content = encrypt_message(data.content)
    
    new_message = Message(
        id=str(uuid.uuid4()),
        content=encrypted_content,
        alias=data.alias,
        created_at=datetime.utcnow(),
        expires_at=expires_at
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return {"id": new_message.id, "created_at": new_message.created_at}

@router.get("/messages/", response_model=List[MessageOut])
def get_messages(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    messages = db.query(Message).filter(
        (Message.expires_at == None) | (Message.expires_at > now)
    ).order_by(Message.created_at.desc()).all()
    
    decrypted_messages = []
    for m in messages:
        decrypted_messages.append(
            MessageOut(
                id=m.id,
                content=decrypt_message(m.content),
                alias=m.alias,
                created_at=m.created_at
            )
        )
        
    return decrypted_messages

@router.get("/messages/{message_id}", response_model=MessageOut)
def get_message_by_id(message_id: str, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if message.expires_at and message.expires_at < datetime.utcnow():
        db.delete(message)
        db.commit()
        raise HTTPException(status_code=404, detail="Message expired")
    
    return MessageOut(
        id=message.id,
        content=decrypt_message(message.content),
        alias=message.alias,
        created_at=message.created_at
    )