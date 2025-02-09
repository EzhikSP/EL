from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_battles():
    return {"message": "Список боёв (заглушка)"}
