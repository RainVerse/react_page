from database.tables import ArticleTable, RelationArticleTag, CommentTable, db


def find_son_comment(c, c_dict):
    for k, v in c_dict.items():
        if v['father_comment_id'] == c['id']:
            find_son_comment(v, c_dict)
            c['sub_comments'].append(v)


def get_article_list_data(offset, limit, auth):
    article_list = []
    if auth and int(auth) == 2:
        all_article = ArticleTable.query.limit(limit).offset(offset).all()
    else:
        all_article = ArticleTable.query.filter_by(is_private=False).limit(limit).offset(offset).all()

    for index, article in enumerate(all_article):
        tags = get_article_tag_data(article.id)
        comments = get_article_comment_data(article.id)
        article_list.append({'id': article.id,
                             'num': offset + index,
                             'title': article.title,
                             'content': article.content,
                             'article_type': article.article_type,
                             'create_time': str(article.create_time),
                             'last_edit_time': str(article.last_edit_time),
                             'is_private': article.is_private,
                             'love_mark': article.love_mark,
                             'tags': tags,
                             'comments': comments,
                             })
    db.session.close()
    return article_list


def get_article_tag_data(article_id):
    tags = []
    tag_relations = RelationArticleTag.query.filter_by(article_id=article_id).all()
    for tag_relation in tag_relations:
        tags.append(tag_relation.tag.tag)
    db.session.close()
    return tags


def get_article_comment_data(article_id):
    comments = {}
    comments_data = CommentTable.query.filter_by(article_id=article_id).all()
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
    db.session.close()
    return final_comments


def get_page_comment_data(offset, limit):
    comments = []
    comments_data = CommentTable.query.filter_by(article_id=None).limit(limit).offset(offset).all()
    for comment in comments_data:
        comments.append({'id': comment.id,
                         'avatar': comment.avatar.src,
                         'guestName': comment.guest_name,
                         'content': comment.content,
                         'create_time': str(comment.create_time),
                         'love_mark': comment.love_mark,
                         })

    db.session.close()
    return comments
