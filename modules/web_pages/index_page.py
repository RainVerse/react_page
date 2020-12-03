from flask import render_template, session
from . import web_pages


@web_pages.route('/')
def index():
    username = session.get('username')
    print(username)
    return render_template('index.html')
