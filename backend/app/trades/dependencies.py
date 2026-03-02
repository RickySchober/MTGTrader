from fastapi import Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import get_session
from app.auth.models import User
from sqlmodel import select
from app.trades.schemas import TradeOfferWrite
from app.trades.models import TradeOffer, TradeItem
from sqlalchemy.orm import selectinload
from app.auth.services import get_current_user

from uuid import UUID

async def validate_trade_users(
    data: TradeOfferWrite,
    session: AsyncSession = Depends(get_session),
) -> TradeOfferWrite:
    stmt = select(User).where(User.id.in_([data.a_user_id, data.b_user_id]))
    result = await session.exec(stmt)
    users = result.all()

    if len(users) != 2:
        raise HTTPException(
            status_code=400,
            detail="One or more users do not exist",
        )
    if data.a_user_id == data.b_user_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot create trade with yourself",
        )
    return data

async def validate_trade_participant(
        trade_id: UUID,
        user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_session),
    ) -> TradeOffer:
    trade = (select(TradeOffer)
            .where(TradeOffer.id == trade_id)
            .options(
            selectinload(TradeOffer.a_user),
            selectinload(TradeOffer.b_user),
            selectinload(TradeOffer.trade_items)
                .selectinload(TradeItem.card)
            ))
    trade = await session.exec(trade)
    trade = trade.one_or_none()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    if user.id != trade.a_user_id and user.id != trade.b_user_id:
        raise HTTPException(
            status_code=403,
            detail="User is not a participant in this trade",
        )
    return trade
