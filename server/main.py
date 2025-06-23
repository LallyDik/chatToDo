from fastapi import FastAPI
from pydantic import BaseModel
from agent_service import agent
from todo_service import get_tasks


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


# Request body model
class MessageRequest(BaseModel):
    message: str


@app.post("/chat")
async def message(request: MessageRequest):
    return await agent(request.message)

@app.get("/tasks")
    async def tasks()
        return todo_service.get_tasks()