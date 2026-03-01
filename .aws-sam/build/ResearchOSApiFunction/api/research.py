from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from backend.services.graph_service import graph_service
from backend.workers.tasks_reasoning import synthesize_ideas_task
from backend.services.llm_reasoning import llm_reasoning
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

router = APIRouter(prefix="/api/research", tags=["research"])

@router.post("/chat")
def chat(request: ChatRequest):
    response = llm_reasoning.chat(request.message, request.context)
    return {"reply": response}

@router.get("/kg")
def get_global_kg(
    center_node: Optional[str] = Query(None),
    depth: int = 2
):
    return graph_service.get_global_subgraph(center_node, depth)

@router.get("/concept/{name}")
def get_concept(name: str):
    details = graph_service.get_concept_details(name)
    if not details:
        raise HTTPException(status_code=404, detail="Concept not found")
    return details

@router.post("/synthesize")
def synthesize_idea(
    concept_names: List[str],
    mode: str = "Cross-Domain Transfer"
):
    # Trigger Async Task
    task = synthesize_ideas_task.delay(concept_names, mode)
    return {"status": "queued", "task_id": task.id}
