# assistant_api.py
import os
import json
import time
import requests

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from openai import OpenAI

load_dotenv()

app = FastAPI(title="Central Asia Assistant Bridge")

# CORS чтобы React/Lovable пускало
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # сузишь потом
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ====== MODELS ======
class StartReq(BaseModel):
    country: str
    lat: float
    lon: float
    location_name: str | None = None


class ContinueReq(BaseModel):
    thread_id: str
    message: str


# ====== HELPERS ======
def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OpenAI(api_key=api_key)


def wait_for_run(client: OpenAI, thread_id: str, run_id: str, timeout_sec: int = 60):
    start = time.time()
    while time.time() - start < timeout_sec:
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        if run.status in ("completed", "failed", "expired", "cancelled"):
            return run
        time.sleep(0.6)
    return run


def handle_tool_calls(client: OpenAI, thread_id: str, run):
    """если ассистент попросил get_geo_context — идём в твой main.py"""
    tool_calls = run.required_action.submit_tool_outputs.tool_calls
    outputs = []

    BACKEND_URL = "https://bf7e4bdb3488.ngrok-free.app"

    for tc in tool_calls:
        if tc.function.name == "get_geo_context":
            args = json.loads(tc.function.arguments)
            try:
                resp = requests.post(
                    BACKEND_URL,
                    json={
                        "lat": args["lat"],
                        "lon": args["lon"],
                        "country": args["country"],
                    },
                    timeout=10,
                )
                resp.raise_for_status()
                payload = resp.json()
            except Exception as e:
                # если твой main.py не запущен — мы всё равно вернём ассистенту ошибку,
                # но не урони́м весь /assistant/start
                payload = {"error": f"geo-context call failed: {e}"}

            outputs.append(
                {
                    "tool_call_id": tc.id,
                    "output": json.dumps(payload),
                }
            )

    run = client.beta.threads.runs.submit_tool_outputs(
        thread_id=thread_id,
        run_id=run.id,
        tool_outputs=outputs,
    )
    return run


def get_last_assistant_message(client: OpenAI, thread_id: str) -> str:
    msgs = client.beta.threads.messages.list(thread_id=thread_id)
    for m in reversed(msgs.data):
        if m.role == "assistant":
            parts = [p.text.value for p in m.content if p.type == "text"]
            return "\n".join(parts)
    return ""


# ====== ROUTES ======
@app.get("/")
def root():
    return {"status": "ok", "msg": "assistant bridge running"}


@app.post("/assistant/start")
def assistant_start(body: StartReq):
    """
    фронт прислал координаты → создаём thread → ассистент → (возможно) tool → ответ
    """
    try:
        client = get_openai_client()
    except RuntimeError as e:
        # тут будет 500 и фронт это увидит
        raise HTTPException(status_code=500, detail=str(e))

    ASSISTANT_ID = os.getenv("ASSISTANT_ID")
    if not ASSISTANT_ID:
        raise HTTPException(status_code=500, detail="ASSISTANT_ID is not set in .env")

    # собираем первый промпт
    user_text = (
        f"User clicked in {body.country.upper()} at coordinates ({body.lat}, {body.lon}). "
        f"Describe this place for a museum touchscreen: geography, nature, minerals, history (if any). "
        f"Answer in English, 3–5 sentences."
    )
    if body.location_name:
      user_text += f" This point is shown on the map UI as '{body.location_name}'. Use it if helpful."

    try:
        # 1. создаём thread
        thread = client.beta.threads.create()

        # 2. кладём первое сообщение
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_text,
        )

        # 3. запускаем run
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=ASSISTANT_ID,
        )

        # 4. смотрим, не нужно ли вызвать tool
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        if run.status == "requires_action":
            run = handle_tool_calls(client, thread.id, run)

        # 5. ждём финала
        run = wait_for_run(client, thread.id, run.id)

        answer = get_last_assistant_message(client, thread.id)
        if not answer:
            answer = "I found this point but there is no detailed description in the database."

        return {
            "thread_id": thread.id,
            "answer": answer,
            "meta": {
                "country": body.country,
                "lat": body.lat,
                "lon": body.lon,
                "location_name": body.location_name,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        # ЛЮБУЮ ошибку отдаём фронту — чтобы ты видел текст
        print("❌ /assistant/start ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=f"/assistant/start failed: {e}")


@app.post("/assistant/continue")
def assistant_continue(body: ContinueReq):
    try:
        client = get_openai_client()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    ASSISTANT_ID = os.getenv("ASSISTANT_ID")
    if not ASSISTANT_ID:
        raise HTTPException(status_code=500, detail="ASSISTANT_ID is not set in .env")

    try:
        # 1. добавляем сообщение пользователя
        client.beta.threads.messages.create(
            thread_id=body.thread_id,
            role="user",
            content=body.message,
        )

        # 2. запускаем ассистента
        run = client.beta.threads.runs.create(
            thread_id=body.thread_id,
            assistant_id=ASSISTANT_ID,
        )

        # 3. на всякий
        run = client.beta.threads.runs.retrieve(thread_id=body.thread_id, run_id=run.id)
        if run.status == "requires_action":
            run = handle_tool_calls(client, body.thread_id, run)

        # 4. ждём
        run = wait_for_run(client, body.thread_id, run.id)

        answer = get_last_assistant_message(client, body.thread_id)
        if not answer:
            answer = "I have no additional information."

        return {"thread_id": body.thread_id, "answer": answer}

    except Exception as e:
        print("❌ /assistant/continue ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=f"/assistant/continue failed: {e}")