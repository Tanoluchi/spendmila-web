from datetime import date
from app.models.enums import SubscriptionFrequency, SubscriptionStatus
from app.models.subscription import Subscription


def renew_subscription(subscription: Subscription) -> date:
    """
    Renew the subscription and calculate the next payment date.
    
    Args:
        subscription: The subscription to renew
        
    Returns:
        The new next payment date
    """
    if subscription.frequency == SubscriptionFrequency.MONTHLY:
        # Add one month to the next payment date
        # Handle month rollover correctly
        month = subscription.next_payment_date.month % 12 + 1
        year = subscription.next_payment_date.year + (subscription.next_payment_date.month // 12)
        day = min(subscription.next_payment_date.day, 
                 [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 
                  31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1])
        subscription.next_payment_date = date(year, month, day)
    elif subscription.frequency == SubscriptionFrequency.YEARLY:
        # Add one year to the next payment date
        subscription.next_payment_date = date(
            subscription.next_payment_date.year + 1, 
            subscription.next_payment_date.month, 
            subscription.next_payment_date.day
        )
    elif subscription.frequency == SubscriptionFrequency.QUARTERLY:
        # Add three months to the next payment date
        month = (subscription.next_payment_date.month + 2) % 12 + 1
        year = subscription.next_payment_date.year + ((subscription.next_payment_date.month + 2) // 12)
        day = min(subscription.next_payment_date.day, 
                 [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 
                  31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1])
        subscription.next_payment_date = date(year, month, day)
    
    # Update status if needed
    if subscription.status == SubscriptionStatus.PENDING_RENEWAL:
        subscription.status = SubscriptionStatus.ACTIVE
        
    return subscription.next_payment_date


def cancel_subscription(subscription: Subscription) -> None:
    """
    Cancel the subscription.
    
    Args:
        subscription: The subscription to cancel
    """
    subscription.status = SubscriptionStatus.CANCELLED


def calculate_days_until_payment(subscription: Subscription) -> int:
    """
    Calculate the number of days until the next payment.
    
    Args:
        subscription: The subscription to calculate for
        
    Returns:
        The number of days until the next payment
    """
    today = date.today()
    delta = subscription.next_payment_date - today
    return delta.days
