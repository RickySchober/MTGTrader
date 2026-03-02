import os
import uuid
import time
import structlog
from app.trades import trades
from app.auth import auth
from app.cards import cards
from app.exceptions import setup_logging, error_response
from app.database import init_db
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

setup_logging()

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

app.add_middleware(SlowAPIMiddleware)

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

logger = structlog.get_logger()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = round((time.time() - start_time) * 1000, 2)

    logger.info(
        "request_completed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=duration,
        request_id=getattr(request.state, "request_id", None),
    )

    return response

# Default rate limiter across app
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"]
)

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return error_response(
        request,
        status_code=429,
        error="TooManyRequests",
        message="Rate limit exceeded. Please slow down.",
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return error_response(
        request,
        status_code=exc.status_code,
        error=exc.__class__.__name__,
        message=str(exc.detail),
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0]
    return error_response(
        request,
        status_code=422,
        error="ValidationError",
        message=first_error["msg"],
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return error_response(
        request,
        status_code=500,
        error="InternalServerError",
        message="Something went wrong.",
    )

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(cards.router)
app.include_router(auth.router)
app.include_router(trades.router)

