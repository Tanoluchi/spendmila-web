from fastapi import APIRouter

from app.api.routes import (
    login,
    private,
    users,
    utils,
    currencies,
    payment_methods,
    categories,
    transactions,
    financial_goals,
    subscriptions,
    debts,
    accounts,
    budgets,
    file_upload
)
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(currencies.router)
api_router.include_router(payment_methods.router)
api_router.include_router(categories.router)
api_router.include_router(transactions.router)
api_router.include_router(financial_goals.router)
api_router.include_router(subscriptions.router)
api_router.include_router(debts.router)
api_router.include_router(accounts.router)
api_router.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
api_router.include_router(file_upload.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
