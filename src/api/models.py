from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


group_participation = db.Table("group_participation",
                               db.Column("participant_id", db.Integer, db.ForeignKey(
                                   "user.id"), primary_key=True),
                               db.Column('group_id', db.Integer, db.ForeignKey(
                                   'group.id'), primary_key=True)
                               )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, default=True)

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
