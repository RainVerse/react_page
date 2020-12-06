from flask import Blueprint

apis = Blueprint('apis', __name__)
from . import base_api, upload_api, get_api
