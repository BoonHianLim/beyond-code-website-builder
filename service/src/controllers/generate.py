from typing import Annotated

from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import HTMLResponse
from pydantic import BaseModel


from src.services.generate import generate_from_struct as service_generate_from_struct, generate_from_partial as service_generate_from_partial, get_generated_html, get_partial_gen_index_html, generate_from_full as service_generate_from_full
from src.utils.logging import LoggingRoute

router = APIRouter(
    prefix='/generator',
    tags=['generator'],
    route_class=LoggingRoute
)


class GenerateStructRequest(BaseModel):
    model: str
    objects: list


@router.post("/struct")
async def generate_from_struct(request: GenerateStructRequest):
    return service_generate_from_struct(request.model, request.objects)

@router.post("/full")
async def generate_from_full(file: UploadFile,
                             type: Annotated[str | None, Form()] = None):
    """
    Generate HTML from a full image and a plugin name.
    """
    return service_generate_from_full(file, type)

@router.post("/partial")
async def generate_from_partial(pluginName: Annotated[str, Form()],
                                html: Annotated[str, Form()],
                                partialImage: UploadFile,
                                model: Annotated[str | None, Form()] = None):

    return {
        "uuid": service_generate_from_partial(pluginName, html, partialImage, model)
    }


@router.get("/partial")
async def get_partial_gen_html(uuid: str):
    return get_generated_html(uuid)


@router.get("/partial/html", response_class=HTMLResponse)
async def get_partial_gen_html_controller():
    return get_partial_gen_index_html()




# @app.post("generate")
# async def generate(request: GenerateRequest):
#     logger.info('start generating...')
#     start = time.time()
#     contents = await request.file.read()
#     image_base64 = base64.b64encode(contents).decode()
#     dino_labled_img, parsed_content_list = omniparser.parse(image_base64)
#     latency = time.time() - start
#     logger.info('generate time: %f', latency)
#     await request.file.close()
#     return {"parsed_content_list": parsed_content_list, 'latency': latency}
