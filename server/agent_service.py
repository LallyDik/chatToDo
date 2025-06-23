import openai
import json
from todo_service import get_tasks, add_task, update_task, delete_task

# רשימת פונקציות המערכת עם תיאורים ופרמטרים בפורמט JSON, לפי מה ש-GPT צריך כדי להבין אותן
functions = [
    {
        "name": "get_tasks",
        "description": "Get list of tasks with optional filters.",
        "parameters": {
            "type": "object",
            "properties": {},
            "additionalProperties": False
        }
    },
    {
        "name": "add_task",
        "description": "Add a new task.",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "title": {"type": "string"},
                "description": {"type": "string"},
                "type": {"type": "string"},
                "start_date": {"type": "string"},
                "end_date": {"type": "string"},
                "status": {"type": "string"}
            },
            "required": ["code", "title"],
            "additionalProperties": False
        }
    },
    {
        "name": "update_task",
        "description": "Update an existing task.",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "title": {"type": "string"},
                "description": {"type": "string"},
                "type": {"type": "string"},
                "start_date": {"type": "string"},
                "end_date": {"type": "string"},
                "status": {"type": "string"}
            },
            "required": ["code"],
            "additionalProperties": False
        }
    },
    {
        "name": "delete_task",
        "description": "Delete a task by code.",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string"}
            },
            "required": ["code"],
            "additionalProperties": False
        }
    }
]

async def agent(query: str) -> str:
    # שליחת השאלה ל-GPT עם הגדרת פונקציות
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": query}],
        functions=functions,
        function_call="auto"
    )
    
    # קבלת הוראת הפונקציה ש-GPT רוצה להפעיל
    message = response['choices'][0]['message']
    
    if message.get("function_call"):
        function_name = message["function_call"]["name"]
        arguments = json.loads(message["function_call"]["arguments"])
        
        # הפעלת הפונקציה המתאימה מקובץ todo_service
        if function_name == "get_tasks":
            result = get_tasks(**arguments)
        elif function_name == "add_task":
            result = add_task(**arguments)
        elif function_name == "update_task":
            result = update_task(**arguments)
        elif function_name == "delete_task":
            result = delete_task(**arguments)
        else:
            result = "Function not found."
        
        # שליחה חוזרת ל-GPT עם התוצאה לקבלת ניסוח תגובה
        final_response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": query},
                {"role": "assistant", "content": f"Result: {result}"}
            ]
        )
        
        return final_response['choices'][0]['message']['content']
    
    # אם אין קריאת פונקציה, מחזירים את התגובה הישירה
    return message['content']
