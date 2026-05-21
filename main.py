from fastapi import FastAPI
from pydantic import BaseModel
import os
import google.generativeai as genai

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI() ke theek neeche yeh lagana padega:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY", "AIzaSyAOCycIwgbvtjWIKQA7ckuQChQZ90P-1Tc"))
model = genai.GenerativeModel(
    model_name="gemini-3.5-flash",
    system_instruction=(
        "You are a friendly assistant embedded in a Tic-Tac-Toe game. "
        "You can chat casually, answer questions about the game rules, "
        "give strategy tips, or just have a fun conversation. "
        "Keep responses concise and friendly."
    )
)

session = {}

class Message(BaseModel):
    session_id : str
    message : str

@app.post("/chat")
async def chat(message: Message):
    if message.session_id not in session:
        session[message.session_id] = model.start_chat()

    chat_session = session[message.session_id]
    response = chat_session.send_message(message.message)
    return {"response": response.text}
