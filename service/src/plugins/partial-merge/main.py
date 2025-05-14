from io import BytesIO
import os
import logging
from PIL import Image

from fastapi import HTTPException, UploadFile

from src.types.plugin_base import PluginBase
from src.utils.extract import extract_html_substring
from src.utils.prompt import get_design_only_combined_prompt

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
CUR_DIR = os.path.dirname(os.path.abspath(__file__))

def get_plugin():
    """
    Returns an instance of the plugin.
    """
    return PartialMergePlugin()


class PartialMergePlugin(PluginBase):
    def get_name(self) -> str:
        """
        Returns the name of the plugin.
        """
        return "Partial Merge Plugin"

    def get_description(self) -> str:
        """
        Returns the description of the plugin.
        """
        return "This plugin is used to merge partial HTML and CSS code."

    def get_ui(self) -> str:
        """
        Returns the HTML code for the plugin.
        """
        html = None
        with open(os.path.join(CUR_DIR, 'static/index.html'), 'r') as f:
            html = f.read()
        return html

    def get_js(self) -> str:
        """
        Returns the JavaScript code for the plugin.
        """
        js = None
        with open(os.path.join(CUR_DIR, 'static/index.js'), 'r') as f:
            js = f.read()
        return js
    
    def generate_code(self, html: str, partial_image: UploadFile, **kwargs) -> str:
        try:
            from google import genai
            from google.genai import types
        except ImportError:
            raise ImportError(
                "Gemini is not installed. Please install it to use this plugin.")
        
        api_key = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        retries = 3

        html_content = None
        retry_count = 0
        while html_content is None and retry_count < retries:
            
            prompt = get_design_only_combined_prompt(html)

            image = Image.open(BytesIO(partial_image.file.read()))

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
