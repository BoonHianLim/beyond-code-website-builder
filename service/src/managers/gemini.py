import logging
import os
from io import BytesIO

from fastapi import HTTPException, UploadFile
from google import genai
from google.genai import types
from PIL import Image

from src.utils.extract import extract_html_substring
from src.utils.prompt import get_role_playing_design_prompt

logger: logging.Logger = logging.getLogger('uvicorn.error')


SAFETY_SETTINGS = [
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE",
    },
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE",
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE",
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE",
    },
    {
        "category": "HARM_CATEGORY_CIVIC_INTEGRITY",
        "threshold": "BLOCK_NONE",
    },
]


def generate_from_design(design: UploadFile, retries: int = 3) -> str:
    """
    Generates code using the Google Gemini API.

    Args:
        html (str): The HTML code to be processed.
        partial_image (str): The path to the image file.
        **kwargs: Additional arguments.

    Returns:
        str: The generated code.
    """
    # Initialize the client
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)

    html_content = None
    retry_count = 0
    
    while html_content is None and retry_count < retries:

        prompt = get_role_playing_design_prompt()

        image = Image.open(BytesIO(design.file.read()))

        response = client.models.generate_content(
             model="gemini-2.0-flash",
             contents=[prompt, image],
             config=types.GenerateContentConfig(
                  temperature=0.5,
                  max_output_tokens=5000,
                  safety_settings=SAFETY_SETTINGS,
                  candidate_count=1,
                  )
             )

        output_texts = response.text.strip()

        html_content = extract_html_substring(output_texts)
        if html_content is not None:
            logger.info('gemini respond a valid html: %s', html_content)
            break

        logger.warning('gemini response is not valid html, retrying...')
        retry_count += 1

    if html_content is None:
        logger.error(
            'gemini response is not valid html after %d retries', retries)
        raise HTTPException(
            status_code=500, detail='gemini response is not valid html after %d retries' % retries)
    return html_content
