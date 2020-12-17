from database.tables import ArticleTable, RelationArticleTag, TagTable, CommentTable, db
import datetime


def upload_article_data(article_type, title, content, tags):
    new_article = ArticleTable(article_type=article_type, title=title, content=content,
                               last_edit_time=datetime.datetime.now())
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


def upload_comment_data(guest_name, article_id, content, comment_id):
    new_comment = CommentTable(guest_name=guest_name, content=content, article_id=article_id, avatar_id=1,
                               father_comment_id=comment_id)
    db.session.add(new_comment)
    db.session.commit()
    db.session.close()
