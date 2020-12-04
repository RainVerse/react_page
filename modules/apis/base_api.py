from . import apis
from flask import request, session, Markup
import json
from config import RAINVERSE_CODE


@apis.route('/get_article_list', methods=['GET'])
def get_article_list():
    username = session.get('username')
    print(username)
    article_list = [{'content': 'hahahahahaha1'}, {'content': '哈哈哈'}, {'content': 'hahahahahaha3'}]
    return json.dumps(article_list, ensure_ascii=False)


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
        session['username'] = username
        return json.dumps({'status': True, 'auth': auth, 'username': username}, ensure_ascii=False)


@apis.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return json.dumps({'status': True}, ensure_ascii=False)


@apis.route('/uploadArticle', methods=['POST'])
def upload_article():
    if not request.form:
        return json.dumps({'status': False}, ensure_ascii=False)
    else:
        username = session.get('username')
        # print(username)
        if username != RAINVERSE_CODE:
            return json.dumps({'status': False}, ensure_ascii=False)
        title = Markup(request.form['title']).striptags()
        content = request.form['content']
        tags = request.form['tags'].split(',')
        for (i, tag) in enumerate(tags):
            tags[i] = Markup(tag).striptags()
        tags = [tag for tag in tags if tag != '' and tag != ',']
        print(title)
        print(len(content))
        print(tags)

        return json.dumps({'status': True}, ensure_ascii=False)
