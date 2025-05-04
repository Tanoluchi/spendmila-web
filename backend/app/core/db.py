from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User
from app.schemas.user import UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    from sqlmodel import SQLModel
    from app.models.currency import Currency
    from app.models.enums import CurrencyCode

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)
    
    # First, check if we have a default currency (USD)
    default_currency = session.exec(
        select(Currency).where(Currency.code == CurrencyCode.USD)
    ).first()
    
    # If not, create the default currency
    if not default_currency:
        default_currency = Currency(
            code=CurrencyCode.USD,
            name="US Dollar",
            symbol="$",
            is_default=True
        )
        session.add(default_currency)
        session.commit()
        session.refresh(default_currency)
    
    # Now check for the user
    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
            default_currency_id=default_currency.id  # Set the default currency
        )        
        user = crud.create_user(session=session, user_create=user_in)
