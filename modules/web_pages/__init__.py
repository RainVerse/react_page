from flask import Blueprint

web_pages = Blueprint('web_pages', __name__)
from . import index_page
