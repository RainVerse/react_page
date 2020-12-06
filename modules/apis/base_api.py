from . import apis
from flask import request, session, Markup
import json
from config import RAINVERSE_CODE
from database.tables import ArticleTable, TagTable, RelationArticleTag, CommentTable, db
import datetime


def find_son_comment(c, c_dict):
    for k, v in c_dict.items():
        if v['father_comment_id'] == c['id']:
            find_son_comment(v, c_dict)
            c['sub_comments'].append(v)


@apis.route('/get_article_list', methods=['GET'])
def get_article_list():
    auth = session.get('auth')
    offset = int(request.args.get('offset'))
    limit = int(request.args.get('limit'))
    article_list = []
    if auth and int(auth) == 2:
        all_article = ArticleTable.query.limit(limit).offset(offset).all()
    else:
        all_article = ArticleTable.query.filter_by(is_private=False).limit(limit).offset(offset).all()

    for article in all_article:
        tags = []
        tag_relations = RelationArticleTag.query.filter_by(article_id=article.id).all()
        for tag_relation in tag_relations:
            tags.append(tag_relation.tag.tag)

        comments = {}
        comments_data = CommentTable.query.filter_by(article_id=article.id).all()
        for comment in comments_data:
            comments[comment.id] = {'id': comment.id,
                                    'avatar': comment.avatar.src,
                                    'guestName': comment.guest_name,
                                    'content': comment.content,
                                    'create_time': str(comment.create_time),
                                    'love_mark': comment.love_mark,
                                    'father_comment_id': comment.father_comment_id,
                                    'sub_comments': [],
                                    }
        final_comments = []
        for k, v in comments.items():
            if not v['father_comment_id']:
                find_son_comment(v, comments)
                final_comments.append(v)

        article_list.append({'id': article.id,
                             'title': article.title,
                             'content': article.content,
                             'article_type': article.article_type,
                             'create_time': str(article.create_time),
                             'last_edit_time': str(article.last_edit_time),
                             'is_private': article.is_private,
                             'love_mark': article.love_mark,
                             'tags': tags,
                             'comments': final_comments,
                             })

    db.session.close()
    is_end = False
    if len(all_article) < limit:
        is_end = True
    return json.dumps({'status': True, 'articleList': article_list, 'isEnd': is_end}, ensure_ascii=False)


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


@apis.route('/uploadArticle', methods=['POST'])
def upload_article():
    if not request.form:
        return json.dumps({'status': False}, ensure_ascii=False)
    else:
        auth = session.get('auth')
        if auth != 2:
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


@apis.route('/uploadComment', methods=['POST'])
def upload_comment():
    if not request.form:
        return json.dumps({'status': False}, ensure_ascii=False)
    else:
        print(session)
        auth = session.get('auth')
        guestName = Markup(request.form['guestName']).striptags()
        if auth == 2:
            guestName = 'RainVerse'
        content = request.form['content']
        if 'articleId' in request.form.keys():
            article_id = request.form['articleId']
        else:
            article_id = None
        if 'commentId' in request.form.keys():
            comment_id = request.form['commentId']
        else:
            comment_id = None

        new_comment = CommentTable(guest_name=guestName, content=content, article_id=article_id, avatar_id=1,
                                   father_comment_id=comment_id)
        db.session.add(new_comment)
        db.session.commit()
        db.session.close()

        return json.dumps({'status': True}, ensure_ascii=False)
