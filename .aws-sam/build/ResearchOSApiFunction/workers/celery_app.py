from celery import Celery
from backend.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.CELERY_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    imports=[
        "backend.workers.health_tasks",
        "backend.workers.tasks_ingestion",
        "backend.workers.tasks_graph",
        "backend.workers.tasks_project",
        "backend.workers.tasks_reasoning"
    ]
)
