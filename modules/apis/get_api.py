from . import apis
from flask import request, session
import json
from database.data_download_api import get_article_list_data, get_article_comment_data


@apis.route('/get_article_list', methods=['GET'])
def get_article_list():
    auth = session.get('auth')
    offset = int(request.args.get('offset'))
    limit = int(request.args.get('limit'))
    article_list = get_article_list_data(offset, limit, auth)
    is_end = False
    if len(article_list) < limit:
        is_end = True
    return json.dumps({'status': True, 'articleList': article_list, 'isEnd': is_end}, ensure_ascii=False)


@apis.route('/get_article_comment', methods=['GET'])
def get_article_comment():
    article_id = int(request.args.get('articleId'))
    comments = get_article_comment_data(article_id)
    return json.dumps({'status': True, 'comments': comments}, ensure_ascii=False)
