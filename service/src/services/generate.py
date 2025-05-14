import logging
import os
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from src.managers.gemini import generate_from_design
from src.managers.ollama import generate_response as ollama_generate_response
from src.services.plugins import get_all_js, get_all_uis, get_plugin_by_name

CUR_DIR = os.path.dirname(os.path.abspath(__file__))
GRANDPARENT_DIR = os.path.dirname(os.path.dirname(CUR_DIR))
STATIC_FILE_DIR = os.path.join(GRANDPARENT_DIR, 'static')

html_registry: dict[str, str] = {}

logger: logging.Logger = logging.getLogger('uvicorn.error')


def generate_from_full(file: UploadFile, model: str) -> str:
    """
    Generate HTML from a full image and a plugin name.
    """
    logger.info(f"Generating from full with model '{model}'")
    if model == 'gpt-4o':
        pass
    elif model == "gemini-2.0-flash":
        return generate_from_design(file)
    else:
        raise HTTPException(
            status_code=400,
            detail="Model not supported. Please use 'gpt-4o' or 'gemini-2.0-flash'."
        )


def generate_from_struct(model: str, objects: list) -> str:
    if model == 'gpt-4o':
        pass
    else:
        return ollama_generate_response(model, objects)


def get_partial_gen_index_html() -> str:
    html = None
    with open(os.path.join(STATIC_FILE_DIR, 'partial.html'), 'r', encoding='utf-8') as f:
        html = f.read()
    all_uis = get_all_uis()
    all_uis_in_arr_string = ",".join(
        ["`" + ui.replace("</script>", "<\/script>") + "`" for ui in all_uis])
    html = html.replace("const INJECTEDCONTENTS = []",
                        f"const INJECTEDCONTENTS = [{all_uis_in_arr_string}]")
    all_js = get_all_js()
    all_js_in_arr_string = "".join(
        ["<script>" + js + "</script>" for js in all_js])
    html = html.replace("<!--ADD MISSING SCRIPT HERE-->",
                        all_js_in_arr_string)
    return html


def generate_from_partial(plugin_name: str, html: str, partial_image: UploadFile, model: str | None = None) -> str:
    logger.info(
        f"Generating from partial with plugin: {plugin_name}, html: {html}, model: {model}")
    plugin = get_plugin_by_name(plugin_name)
    if plugin is None:
        raise ValueError(f"Plugin '{plugin_name}' not found.")
    uuid = str(uuid4())
    generated_html = plugin.generate_code(html, partial_image, model=model)
    html_registry[uuid] = generated_html
    return uuid


def get_generated_html(uuid: str) -> str:
    if uuid not in html_registry:
        raise ValueError(f"UUID '{uuid}' not found.")
    return html_registry[uuid]
