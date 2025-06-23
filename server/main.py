from fastapi import FastAPI
from pydantic import BaseModel
from agent_service import agent

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


# Request body model
class MessageRequest(BaseModel):
    message: str


@app.post("/completion")
async def message(request: MessageRequest):
    return await agent(request.message)
