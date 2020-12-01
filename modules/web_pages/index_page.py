from flask import render_template
from . import web_pages


@web_pages.route('/')
def index():
    info = 'background info'
    return render_template('index.html', info=info)
