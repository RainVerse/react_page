from . import apis
from flask import request, session, Markup
import json
from config import RAINVERSE_CODE
from database.tables import ArticleTable, TagTable, RelationArticleTag, db
import datetime


@apis.route('/get_article_list', methods=['GET'])
def get_article_list():
    offset = int(request.args.get('offset'))
    limit = int(request.args.get('limit'))
    article_list = []
    all_article = ArticleTable.query.limit(limit).offset(offset).all()
    for article in all_article:
        article_list.append({'title': article.title,
                             'content': article.content,
                             'article_type': article.article_type,
                             'create_time': str(article.create_time),
                             'last_edit_time': str(article.last_edit_time),
                             'is_private': article.is_private})
    db.session.close()
    is_end = False
    if len(all_article) < limit:
        is_end = True
    return json.dumps({'articleList': article_list, 'isEnd': is_end}, ensure_ascii=False)


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
        new_article = ArticleTable(article_type=0, title=title, content=content, last_edit_time=datetime.datetime.now())
        db.session.add(new_article)
        for tag in tags:
            cur_tag = TagTable.query.filter_by(tag=tag).first()
            if cur_tag is None:
                cur_tag = TagTable(tag=tag, article_num=1)
                db.session.add(cur_tag)
            else:
                cur_tag.article_num += 1
            db.session.flush()
            relation = RelationArticleTag(article_id=new_article.id, tag_id=cur_tag.id)
            db.session.add(relation)
        db.session.commit()
        db.session.close()

        return json.dumps({'status': True}, ensure_ascii=False)
