
import base64
import logging
import time

from fastapi import APIRouter, UploadFile
from pydantic import BaseModel

from src.services.omni_parser import Omniparser
from src.utils.logging import LoggingRoute
logger: logging.Logger = logging.getLogger('uvicorn.error')

router = APIRouter(
    prefix='/parser',
    tags=['parser'],
    route_class=LoggingRoute
)

# omniparser = Omniparser()


class ParseRequest(BaseModel):
    base64_image: str


# @router.post("/")
# async def parse(parse_request: ParseRequest):
#     logger.info('start parsing...')
#     start = time.time()
#     dino_labled_img, parsed_content_list = omniparser.parse(
#         parse_request.base64_image)
#     latency = time.time() - start
#     logger.info('parse time: %f', latency)
#     return {"parsed_content_list": parsed_content_list, 'latency': latency}


# @router.post("/file")
# async def parse_file(file: UploadFile):
#     logger.info('start parsing...')
#     start = time.time()
#     contents = await file.read()
#     image_base64 = base64.b64encode(contents).decode()
#     dino_labled_img, parsed_content_list = omniparser.parse(image_base64)
#     latency = time.time() - start
#     logger.info('parse time: %f', latency)
#     await file.close()
#     return {"parsed_content_list": parsed_content_list, 'latency': latency}
