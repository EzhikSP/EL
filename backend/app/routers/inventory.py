from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.player import Player
from app.models.inventory import InventoryItem
from app.schemas.dto.inventory import ItemTransfer
from app.auth_utils import get_current_user

router = APIRouter()

@router.post("/transfer")
def transfer_item(data: ItemTransfer, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Передача предмета другому игроку"""
    item = db.query(InventoryItem).filter(InventoryItem.id == data.item.id, InventoryItem.owner_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Предмет не найден")

    recipient = db.query(Player).filter(Player.id == data.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Получатель не найден")

    tax = 1  # Налог на передачу (1 медная монета)
    if data.price and recipient.gold < data.price + tax:
        raise HTTPException(status_code=400, detail="Недостаточно средств у получателя")

    # Обновляем данные
    if data.price:
        recipient.gold -= data.price + tax
        user.gold += data.price
    item.owner_id = recipient.id
    db.commit()
    
    return {"message": "Предмет передан"}
    
@router.delete("/{player_id}/drop/{item_id}")
def drop_item(player_id: int, item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Удаление предмета из инвентаря игрока"""
    item = db.query(InventoryItem).filter_by(id=item_id, player_id=player_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Предмет не найден")

    db.delete(item)
    db.commit()

    return {"message": "Предмет выброшен"}
