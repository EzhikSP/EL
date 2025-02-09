from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.locations import Location, Building
from app.auth_utils import get_current_user

router = APIRouter()

@router.get("/location/{location_id}")
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    return location

@router.get("/location/{location_id}/buildings")
def get_buildings_in_location(location_id: int, db: Session = Depends(get_db)):
    buildings = db.query(Building).filter(Building.location_id == location_id).all()
    return buildings

@router.post("/move/{direction}")
def move_player(direction: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    player = user  # Здесь предполагается, что у пользователя есть поле current_location
    location = db.query(Location).filter(Location.id == player.current_location).first()

    if not location:
        raise HTTPException(status_code=404, detail="Текущая локация не найдена")

    new_location_id = getattr(location, f"{direction}_id", None)

    if new_location_id is None:
        raise HTTPException(status_code=400, detail="Нельзя переместиться в этом направлении")

    player.current_location = new_location_id
    db.commit()
    
    return {"message": "Перемещение успешно", "new_location_id": new_location_id}
