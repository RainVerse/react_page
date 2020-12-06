from flask import render_template, session
from . import web_pages


@web_pages.route('/')
def index():
    auth = session.get('auth')
    print(auth)
    return render_template('index.html')
