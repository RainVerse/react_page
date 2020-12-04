from start import db
from sqlalchemy import Column, DateTime, Integer, String, Boolean, text, ForeignKey
from sqlalchemy.dialects.mysql import LONGTEXT

metadata = db.Model.metadata


class ArticleTable(db.Model):
    __tablename__ = 'article_table'

    id = Column(Integer, primary_key=True)
    article_type = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(LONGTEXT, nullable=False)
    create_time = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    last_edit_time = Column(DateTime, nullable=False)
    is_private = Column(Boolean, nullable=False, server_default=text('0'))


class TagTable(db.Model):
    __tablename__ = 'tag_table'

    id = Column(Integer, primary_key=True)
    tag = Column(String, nullable=False, unique=True)
    article_num = Column(Integer, nullable=False, server_default=text('0'))


class RelationArticleTag(db.Model):
    __tablename__ = 'relation_article_tag'

    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey("article_table.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tag_table.id"), nullable=False)


class ImageTable(db.Model):
    __tablename__ = 'image_table'

    id = Column(Integer, primary_key=True)
    image_src = Column(String, nullable=False)
    count = Column(Integer, nullable=False)
    article_id = Column(Integer, ForeignKey("article_table.id"), nullable=False)


if __name__ == '__main__':
    tg1 = TagTable(tag='りんさよ')
    db.session.add(tg1)
    db.session.commit()
