from . import apis
from flask import request, session, Markup
import json
from config import RAINVERSE_CODE


@apis.route('/login', methods=['POST'])
def login():
    if not request.form:
        return json.dumps({'status': False}, ensure_ascii=False)
    else:
        username = Markup(request.form['username']).striptags()
        if 0 < len(username) < 16:
            auth = 1
        else:
            return json.dumps({'status': False}, ensure_ascii=False)
        if username == RAINVERSE_CODE:
            auth = 2
        session['auth'] = str(auth)
        print(session)
        return json.dumps({'status': True, 'auth': auth, 'username': username}, ensure_ascii=False)


@apis.route('/logout', methods=['GET'])
def logout():
    session.pop('auth', None)
    return json.dumps({'status': True}, ensure_ascii=False)
