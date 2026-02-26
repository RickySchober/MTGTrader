from app.trades import trades
from app.auth import auth
from fastapi import FastAPI
from app.cards import cards
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from slowapi.middleware import SlowAPIMiddleware
import os
import uuid
from fastapi import Request

app = FastAPI(title="MTG Trader API")

ENV = os.getenv("ENV", "development")
NETLIFY_URL = os.getenv("NETLIFY_URL")

if ENV == "production":
    allowed_origins = [NETLIFY_URL] if NETLIFY_URL else []
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    request_id = getattr(request.state, "request_id", None)

    return JSONResponse(
        status_code=429,
        content={
            "error": "TooManyRequests",
            "message": "Rate limit exceeded. Please slow down.",
            "status_code": 429,
            "request_id": request_id,
        },
    )

@app.middleware("http")
@limiter.limit("200/minute")
async def global_limit(request, call_next):
    return await call_next(request)

app.add_middleware(SlowAPIMiddleware)

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.__class__.__name__,
            "message": exc.detail,
            "status_code": exc.status_code,
            "request_id": request_id,
        },
    )

from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0]
    request_id = getattr(request.state, "request_id", None)

    return JSONResponse(
        status_code=422,
        content={
            "error": "ValidationError",
            "message": first_error["msg"],
            "status_code": 422,
            "request_id": request_id,
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "Something went wrong.",
            "status_code": 500,
            "request_id": request_id,
        },
    )
@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(cards.router)
app.include_router(auth.router)
app.include_router(trades.router)

