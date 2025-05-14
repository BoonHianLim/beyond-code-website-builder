import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.services.plugins import scan_plugins, watch_plugins
from src.utils.logging import setup_logger
from src.services.match import get_model, init_vector_db, match
from src.controllers.generate import router as generate_router
from src.controllers.parser import router as parser_router

load_dotenv()
setup_logger()
scan_plugins()
watch_plugins()

logger: logging.Logger = logging.getLogger('uvicorn.error')
print = logger.info

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


class MatchRequest(BaseModel):
    prompt: str


@app.post("/match")
def read_item(item: MatchRequest):
    model = get_model()
    index = init_vector_db(model)
    return {"template": match(item.prompt, model, index)}


app.include_router(parser_router)
app.include_router(generate_router)
app.mount("/static", StaticFiles(directory="static"), name="static")
