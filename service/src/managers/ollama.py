import json
import logging

from fastapi import HTTPException
from ollama import chat
from ollama import ChatResponse
from ollama import Client

from src.utils.extract import extract_html_substring
from src.utils.prompt import USER_PROMPT

logger: logging.Logger = logging.getLogger('uvicorn.error')

client = Client(
    host='http://localhost:11434',
)


def generate_response(model: str, objects: list, retries: int = 3) -> str:
    logger.info('ollama generating response, using model: %s', model)
    html_content = None
    retry_count = 0
    while html_content is None and retry_count < retries:
        response: ChatResponse = client.chat(
            model=model,
            messages=[
                {
                    'role': 'user',
                    'content': USER_PROMPT + json.dumps(objects),
                }],
            options={
                "temperature": 0.7,
            }
        )
        html_content = extract_html_substring(response.message.content)
        if html_content is not None:
            logger.info('ollama respond a valid html: %s', html_content)
            break

        logger.warning('ollama response is not valid html, retrying...')
        retry_count += 1

    if html_content is None:
        logger.error('ollama response is not valid html after %d retries', retries)
        raise HTTPException(status_code=500, detail='ollama response is not valid html after %d retries' % retries)
    return html_content
