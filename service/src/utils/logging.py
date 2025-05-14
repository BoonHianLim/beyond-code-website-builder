import logging
import logging.config
import os
import time
import sys
from typing import Callable

from fastapi import Response, Request
from starlette.background import BackgroundTask
from starlette.responses import StreamingResponse
from fastapi.routing import APIRoute

logger: logging.Logger = logging.getLogger('uvicorn.error')

_current_datetime = time.strftime("%Y%m%d-%H%M%S")
_parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_grandparent_dir = os.path.dirname(_parent_dir)
log_path = os.path.join(_grandparent_dir, "logs")
log_file_path = os.path.join(log_path, _current_datetime + '.log')

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "%(asctime)s [%(levelname)s] %(filename)s:%(lineno)s: %(message)s"},
    },
    "handlers": {
        "default": {
            "level": "INFO",
            "formatter": "standard",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "file": {
            "level": "NOTSET",
            "formatter": "standard",
            "class": "logging.FileHandler",
            "filename": log_file_path,
            "mode": "a",
            "encoding": "utf-8",
        },
    },
    "loggers": {
        "": {  # root logger
            "level": "NOTSET",
            "handlers": ["default", "file"],
            "propagate": False,
        },
        "uvicorn": {
            "level": "NOTSET",
            "handlers": ["default", "file"],
            "propagate": False,
        },
        "uvicorn.error": {
            "level": "NOTSET",
            "handlers": ["default", "file"],
            "propagate": False,
        },
        "uvicorn.access": {
            "level": "NOTSET",
            "handlers": ["default", "file"],
            "propagate": False,
        },
    },
}


def setup_logger():
    sys.stderr.reconfigure(encoding="utf-8")
    os.makedirs(log_path, exist_ok=True)
    logging.config.dictConfig(LOGGING_CONFIG)
    logger.info("Logging initialized")


def log_info(req_body, res_body):
    logger.log(5, req_body)
    logger.log(5, res_body)


class LoggingRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            req_body = await request.body()
            response = await original_route_handler(request)
            tasks = response.background

            if isinstance(response, StreamingResponse):
                chunks = []
                async for chunk in response.body_iterator:
                    chunks.append(chunk)
                res_body = b''.join(chunks)

                task = BackgroundTask(log_info, req_body, res_body)
                response = Response(content=res_body, status_code=response.status_code,
                                    headers=dict(response.headers), media_type=response.media_type)
            else:
                task = BackgroundTask(log_info, req_body, response.body)

            # check if the original response had background tasks already attached to it
            if tasks:
                tasks.add_task(task)  # add the new task to the tasks list
                response.background = tasks
            else:
                response.background = task

            return response

        return custom_route_handler
