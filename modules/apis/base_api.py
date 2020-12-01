from . import apis
from flask import request
import json


@apis.route('/get_article_list', methods=['GET'])
def get_article_list():
    article_list = [{'content': 'hahahahahaha1'}, {'content': '1111111111111'}, {'content': 'hahahahahaha3'}]

    return json.dumps(article_list, ensure_ascii=False)
