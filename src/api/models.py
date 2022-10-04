from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


group_participation = db.Table("group_participation",
                               db.Column("participant_id", db.Integer, db.ForeignKey(
                                   "user.id"), primary_key=True),
                               db.Column('group_id', db.Integer, db.ForeignKey(
                                   'group.id'), primary_key=True)
                               )

friend = db.Table('friend',
                  db.Column('user_id1', db.Integer, db.ForeignKey(
                      'user.id'), primary_key=True),
                  db.Column("user_id2", db.Integer, db.ForeignKey(
                      "user.id"), primary_key=True),
                  db.Column("is_favorite", db.Boolean, default=False))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, default=True)
    # necesito uselist = false porque es una relacion 1 a 1
    user_data = db.relationship(
        'User_Data', backref='user', lazy=True, uselist=False)

    group_participation = db.relationship('Group', secondary=group_participation, lazy='subquery',
                                          backref=db.backref('users', lazy=True))

    group = db.relationship('Group', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,

        }


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    # One-to-Many Relationships
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                         nullable=False)
    private = db.Column(db.Boolean(), unique=True)

    def __repr__(self):
        return f'<Group {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.email,
            "owner_id": self.owner_id,
            "private": self.private

        }


class User_Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    address = db.Column(db.String(120), unique=False, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    profile_picture = db.Column(
        db.Integer(), db.ForeignKey('image.id'), nullable=True)
    image_id = db.relationship('Image', backref='user_data', lazy=True)

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
    owner_id = db.Column(db.Integer, db.ForeignKey(
        'user_data.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "owner_id": self.owner_id
        }
