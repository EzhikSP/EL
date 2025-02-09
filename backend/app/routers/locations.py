from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.locations import Location
from app.dto.locations import LocationCreate, LocationUpdate, LocationResponse
from app.auth_utils import get_current_user

router = APIRouter()


@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    """Получить информацию о локации по её ID"""
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    return location


@router.post("/move/{direction}", response_model=LocationResponse)
def move_player(direction: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Перемещение игрока в локацию по направлению"""
    # Получаем текущую локацию игрока
    player_location = user.current_location  # Предполагаем, что у пользователя есть поле current_location
    location = db.query(Location).filter(Location.id == player_location).first()

    if not location:
        raise HTTPException(status_code=404, detail="Текущая локация не найдена")

    # Проверяем, можно ли двигаться в нужном направлении
    new_location_id = getattr(location, f"{direction}_id", None)

    if new_location_id is None:
        raise HTTPException(status_code=400, detail=f"Невозможно переместиться в направлении {direction}")

    # Обновляем текущую локацию игрока
    user.current_location = new_location_id
    db.commit()

    # Получаем новую локацию
    new_location = db.query(Location).filter(Location.id == new_location_id).first()

    return new_location


@router.post("/", response_model=LocationResponse)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    """Создание новой локации"""
    db_location = Location(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location


@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, location: LocationUpdate, db: Session = Depends(get_db)):
    """Обновить данные локации"""
    db_location = db.query(Location).filter(Location.id == location_id).first()
    if not db_location:
        raise HTTPException(status_code=404, detail="Локация не найдена")

    for key, value in location.dict(exclude_unset=True).items():
        setattr(db_location, key, value)

    db.commit()
    db.refresh(db_location)
    return db_location
