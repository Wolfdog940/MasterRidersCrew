from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship
import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__='user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, default=True)
    posts = db.relationship('Post', foreign_keys='Post.user_id', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }

class Post(db.Model):
    __tablename__='post'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(5000), unique=False, nullable=True)
    image = db.Column(db.String(5000), unique=False, nullable=True)
    datetime = db.Column(DateTime, nullable=False, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)