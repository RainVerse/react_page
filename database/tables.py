from start import db
from sqlalchemy import Column, DateTime, Integer, String, Boolean, text, ForeignKey
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import relationship

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
    love_mark = Column(Integer, nullable=False, server_default=text('0'))


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
    tag = relationship("TagTable", backref="relation_article_tag_of_tag_table")


class ImageTable(db.Model):
    __tablename__ = 'image_table'

    id = Column(Integer, primary_key=True)
    image_src = Column(String, nullable=False)
    count = Column(Integer, nullable=False)
    article_id = Column(Integer, ForeignKey("article_table.id"), nullable=False)


class AvatarTable(db.Model):
    __tablename__ = 'avatar_table'

    id = Column(Integer, primary_key=True)
    src = Column(String, nullable=False)
    description = Column(String, nullable=False)


class CommentTable(db.Model):
    __tablename__ = 'comment_table'

    id = Column(Integer, primary_key=True)
    content = Column(LONGTEXT, nullable=False)
    guest_name = Column(String, nullable=False)
    create_time = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    love_mark = Column(Integer, nullable=False, server_default=text('0'))
    article_id = Column(Integer, ForeignKey("article_table.id"))
    avatar_id = Column(Integer, ForeignKey("avatar_table.id"), nullable=False)
    avatar = relationship("AvatarTable", backref="comment_table_of_avatar_table")
    father_comment_id = Column(Integer, ForeignKey("comment_table.id"))


if __name__ == '__main__':
    tg1 = TagTable(tag='りんさよ')
    db.session.add(tg1)
    db.session.commit()
