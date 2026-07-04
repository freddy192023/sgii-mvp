from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Message
from ..schemas import MessageCreate, MessageResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["messages"])

@router.get("/", response_model=List[MessageResponse])
def get_messages(
    channel: Optional[str] = "general",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    messages = db.query(Message).filter(Message.channel == channel).order_by(Message.created_at.asc()).all()
    return messages

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_message = Message(
        channel=message.channel,
        content=message.content,
        sender_id=current_user.id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
