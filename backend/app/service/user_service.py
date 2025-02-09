# Пример сервиса для работы с пользователями
def get_player_by_username(db, username: str):
    return db.query().filter_by(username=username).first()
