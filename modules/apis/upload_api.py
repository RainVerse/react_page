from . import apis
from flask import request, session, Markup
import json
from database.data_upload_api import upload_article_data, upload_comment_data


@apis.route('/uploadArticle', methods=['POST'])
def upload_article():
    if not request.form:
        return json.dumps({'status': False}, ensure_ascii=False)
    else:
        auth = session.get('auth')
        if int(auth) != 2:
            return json.dumps({'status': False}, ensure_ascii=False)
        title = Markup(request.form['title']).striptags()
        content = Markup(request.form['content']).striptags()
        tags = request.form['tags'].split(',')
        for (i, tag) in enumerate(tags):
            tags[i] = Markup(tag).striptags()
        tags = [tag for tag in tags if tag != '' and tag != ',']

        upload_article_data(0, title, content, tags)

        return json.dumps({'status': True}, ensure_ascii=False)


@apis.route('/uploadComment', methods=['POST'])
def upload_comment():
    if not request.form:
        return json.dumps({'status': False}, ensure_ascii=False)
    else:
        print(session)
        auth = session.get('auth')
        guest_name = Markup(request.form['guestName']).striptags()
        if int(auth) == 2:
            guest_name = 'RainVerse'
        content = Markup(request.form['content']).striptags()
        if 'articleId' in request.form.keys():
            article_id = request.form['articleId']
        else:
            article_id = None
        if 'commentId' in request.form.keys():
            comment_id = request.form['commentId']
        else:
            comment_id = None
        upload_comment_data(guest_name, article_id, content, comment_id)
        return json.dumps({'status': True}, ensure_ascii=False)
