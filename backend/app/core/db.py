from sqlmodel import Session, create_engine, select
import logging

from app import crud
from app.core.config import settings
from app.models import User
from app.schemas.user import UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28

logger = logging.getLogger(__name__)

def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    from sqlmodel import SQLModel
    from app.models.currency import Currency
    from app.models.enums import CurrencyCode

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)
    
    # Define a list of essential currencies to ensure they exist
    essential_currencies_data = [
        {"code": CurrencyCode.USD, "name": "US Dollar", "symbol": "$", "is_default": True},
        {"code": CurrencyCode.EUR, "name": "Euro", "symbol": "€", "is_default": False},
        {"code": CurrencyCode.ARS, "name": "Argentine Peso", "symbol": "$", "is_default": False},
    ]

    default_currency_from_db = None

    for currency_data in essential_currencies_data:
        currency_exists = session.exec(
            select(Currency).where(Currency.code == currency_data["code"].value) # Use .value for enum comparison
        ).first()

        if not currency_exists:
            new_currency = Currency(
                code=currency_data["code"].value,
                name=currency_data["name"],
                symbol=currency_data["symbol"],
                is_default=currency_data["is_default"]
            )
            session.add(new_currency)
            logger.info(f"Creating essential currency: {new_currency.code}")
            if new_currency.is_default:
                default_currency_from_db = new_currency
        elif currency_data["is_default"]:
            default_currency_from_db = currency_exists

    session.commit() # Commit all new currencies

    if default_currency_from_db:
        # It's possible the default currency already existed and was fetched,
        # or it was newly created. Refresh ensures it's up-to-date from DB.
        if not session.is_modified(default_currency_from_db):
             session.refresh(default_currency_from_db)
    else:
        # This case should ideally not be reached if USD is correctly defined as default
        # in essential_currencies_data. Fallback to be safe.
        default_currency_from_db = session.exec(
            select(Currency).where(Currency.code == CurrencyCode.USD.value)
        ).first()
        if not default_currency_from_db:
            raise RuntimeError("Default currency (USD) could not be found or created. DB init failed.")
    
    # Now check for the user
    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            first_name="Admin",
            last_name="User",
            profile_picture=None,
            is_superuser=True,
            default_currency_id=default_currency_from_db.id  # Set the default currency
        )        
        user = crud.create_user(session=session, user_create=user_in)
