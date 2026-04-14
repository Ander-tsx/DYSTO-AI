import logging

from loguru import logger


class InterceptorHandler(logging.Handler):
    """
    Redirects all standard Python logging (Django, DRF, simplejwt, etc.)
    through Loguru so every library log is captured in the same sinks.
    """

    def emit(self, record):
        # Map the standard level name to a Loguru level.
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Walk up the call stack to find the real caller frame,
        # skipping internal logging module frames.
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )
