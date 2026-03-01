from backend.main import app  # noqa: F401 — FastAPI entrypoint re-export

# Also expose the Mangum handler for AWS Lambda
from backend.main import handler  # noqa: F401


def main():
    """Run the Research OS backend server."""
    import uvicorn
    from backend.core.config import settings
    uvicorn.run("main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)


if __name__ == "__main__":
    main()
