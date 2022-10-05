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
    posts = db.relationship('Post', backref='user', lazy= True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Post(db.Model):
    __tablename__='post'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(5000), unique=False, nullable=True)
    image = db.Column(db.String(5000), unique=False, nullable=True)
    datetime = db.Column(DateTime, nullable=False, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "image": self.image,
            "datetime": self.datetime,
            "user_id": self.user_id,
        }