from fastapi import APIRouter

router = APIRouter()

@router.get("/locations")
def get_locations():
    return {"message": "Список локаций (заглушка)"}
