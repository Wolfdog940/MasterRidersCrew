from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship
import datetime

db = SQLAlchemy()


class Event_comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'),
                         nullable=False)
    comment = db.Column(db.String(), unique=False, nullable=False)
    creation_date = db.Column(DateTime, nullable=False, unique=False,
                              default=datetime.datetime.utcnow())

    def __repr__(self):
        return f'<Event_comments {self.id}>'

    def serialize(self):
        user_data = User_Data.query.filter_by(user_id=self.user_id).first()
        user_data = user_data.serialize()
        image = Image.query.get(user_data["profile_picture"])
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "comment": self.comment,
            "creation_date": self.creation_date,
            "user_name": user_data["name"],
            "profile_picture": image.image
        }


class Post_comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'),
                        nullable=False)
    comment = db.Column(db.String(), unique=False, nullable=False)
    creation_date = db.Column(DateTime, nullable=False, unique=False,
                              default=datetime.datetime.utcnow())

    def __repr__(self):
        return f'<Post_comments {self.id}>'

    def serialize(self):
        user_data = User_Data.query.filter_by(user_id=self.user_id).first()
        user_data = user_data.serialize()
        image = Image.query.get(user_data["profile_picture"])
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "comment": self.comment,
            "creation_date": self.creation_date,
            "user_name": user_data["name"],
            "profile_picture": image.image
        }


class Group_participation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'),
                         nullable=False)

    def __repr__(self):
        return f'<Group_participation {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "group_id": self.group_id
        }


class Event_participation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'),
                         nullable=False)

    def __repr__(self):
        return f'<Event_participation {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id
        }

    def return_event(self):
        event = Event.query.get(self.event_id)
        return (event.serialize())


class Form_friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    main_friend_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                               nullable=False)
    secondary_friend_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                                    nullable=False)

    def __repr__(self):
        return f'<Form_friendship {self.id}>'

    def serialize_list_friend(self):
        profile_picture = None
        favorite = User_Data.query.filter_by(user_id = self.secondary_friend_id).first()
        if favorite.profile_picture is not None:
            favorite_profile_picture = Image.query.get(favorite.profile_picture)
            profile_picture = favorite_profile_picture.image

        return{
            "id": self.id,
            "main_friend_id": self.main_friend_id,
            "secondary_friend_id": self.secondary_friend_id,
            "profilePicture": profile_picture,
            "friend_name": favorite.name,
            "friend_last_name": favorite.last_name,
            "address": favorite.address
        }        

    def serialize_delete(self):
        profile_picture = None
        user = User_Data.query.filter_by(user_id = self.secondary_friend_id).first()
        if user.profile_picture is not None:
            user_profile_picture = Image.query.get(user.profile_picture)
            profile_picture = user_profile_picture.image
        return{
            "id": self.id,
            "main_friend_id": self.main_friend_id,
            "secondary_friend_id": self.secondary_friend_id,
            "profilePicture": profile_picture,
            "friend_name": user.name,
            "friend_last_name": user.last_name,
            "address": user.address
        }

    def serialize(self):
        return {
            "id": self.id,
            "main_friend_id": self.main_friend_id,
            "secondary_friend_id": self.secondary_friend_id
        }


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, default=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # "participant":self.group
        }


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                         nullable=False)
    private = db.Column(db.Boolean(), unique=False)

    def __repr__(self):
        return f'<Group {self.name}>'  # representacion de la clase

    def serialize(self):

        return {
            "id": self.id,
            "name": self.name,
            "owner_id": self.owner_id,
            "private": self.private,

            # participation es un objeto Usuario y tengo que serializarlo
        }

    def serialize_name(self):
        return {
            "name": self.name
        }


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    start = db.Column(db.String(), unique=False, nullable=False)
    end = db.Column(db.String(), unique=False, nullable=False)
    map = db.Column(db.String(), unique=False, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)
    date = db.Column(db.String(), nullable=False)
    private = db.Column(db.Boolean(), unique=False)
    slug = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=False)
    origin_lon = db.Column(db.Float(), unique=False, nullable=False)
    origin_lat = db.Column(db.Float(), unique=False, nullable=False)
    destination_lon = db.Column(db.Float(), unique=False, nullable=False)
    destination_lat = db.Column(db.Float(), unique=False, nullable=False)
    hours = db.Column(db.String(), unique=False, nullable=False)
    minutes = db.Column(db.String(), unique=False, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "start": self.start,
            "end": self.end,
            "map": self.map,
            "owner_id": self.owner_id,
            "date": self.date,
            "private": self.private,
            "slug": self.slug,
            "description": self.description,
            "origin_lon": self.origin_lon,
            "origin_lat": self.origin_lat,
            "destination_lon": self.destination_lon,
            "destination_lat": self.destination_lat,
            "hours": self.hours,
            "minutes": self.minutes
        }


class User_Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    address = db.Column(db.String(120), unique=False, nullable=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    profile_picture = db.Column(
        db.Integer(), db.ForeignKey('image.id'), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "address": self.address,
            "user_id": self.user_id,
            "profile_picture": self.profile_picture
        }


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(), unique=False, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_data_id = db.relationship('User_Data', backref='image', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "owner_id": self.owner_id
        }


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(5000), unique=False, nullable=True)

    created_at = db.Column(DateTime, nullable=False,
                           default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    image_id = db.Column(db.Integer, db.ForeignKey('image.id'), nullable=True)

    def serialize_image(self):
        if self.image_id is None:
            return self.serialize()

        image = Image.query.get(self.image_id)
        image = image.serialize()

        return {
            "id": self.id,
            "text": self.text,
            "image": image["image"],
            "image_id": self.image_id,
            "date": self.created_at,
            "user_id": self.user_id

        }

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,

            "date": self.created_at,
            "user_id": self.user_id
        }
