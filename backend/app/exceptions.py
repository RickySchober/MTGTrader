import logging
import structlog
from fastapi.responses import JSONResponse
from fastapi import Request
from app.models import ErrorResponse

def error_response(
    request: Request,
    status_code: int,
    error: str,
    message: str,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            error=error,
            message=message,
            status_code=status_code,
            request_id=getattr(request.state, "request_id", None),
        ).model_dump(),
    )

def setup_logging():
    logging.basicConfig(level=logging.INFO)

    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.JSONRenderer(),
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
    )