from sqlalchemy.orm import Session
from typing import TypeVar

T = TypeVar('T')


class TranzyService:

    def save_entity(self, entity: [T], db: Session):
        db.add(entity)
        db.commit()
        return entity

    def delete_all(self, entity: [T], db: Session):
        db.query(entity).delete()
        db.commit()
        return entity
