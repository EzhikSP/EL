from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_craft_items():
    return {"message": "Список крафтовых предметов (заглушка)"}
