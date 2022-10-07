"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql import text
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, get_jwt
from slugify import slugify

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if email is None:
        return jsonify({"msg": "Email is missing, write one, please!"}), 404
    if password is None:
        return jsonify({"msg": "Password is missing, write one, please!"}), 404
    user = User.query.filter_by(email=email).first()
    if user is not None:
        return jsonify({"msg": "Sorry. User already exist!"}), 409

    new_user = User(
        email=email,
        password=password,
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 200


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    if email is None:
        return jsonify({"msg": "Need an email to login"}), 401
    password = request.json.get("password", None)
    if password is None:
        return jsonify({"msg": "Need a password to login"}), 401
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id}), 200


@api.route("/event", methods=["POST"])
@jwt_required()
def add_event():
    name = request.json.get("name", None)
    if name is None:
        return jsonify({"msg": "Need a name to register an event"}), 401
    event_name_exists = Event.query.filter_by(name=name).first()
    if event_name_exists is not None:
        return jsonify({"msg": "Name already taken"}), 401
    start = request.json.get("start", None)
    if start is None:
        return jsonify({"msg": "Need a start to register an event"}), 401
    end = request.json.get("end", None)
    if end is None:
        return jsonify({"msg": "Need an end to register an event"}), 401
    owner_id = get_jwt_identity()
    date = request.json.get("date", None)
    if date is None:
        return jsonify({"msg": "Need a date to register an event"}), 401
    private = request.json.get("private", None)
    if private is None:
        return jsonify({"msg": "Undeclared group privacy"}), 401
    slug = slugify(name)
    description = request.json.get("description", None)

    new_event = Event(
        name=name,
        start=start,
        end=end,
        owner_id=owner_id,
        date=date,
        private=private,
        slug=slug,
        description=description
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.serialize()), 200


@api.route("/event/<int:event_id>", methods=["GET"])
@jwt_required()
def get_event(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    return jsonify(user.serialize()), 200


@api.route("/event/<int:event_id>", methods=["DELETE"])
@jwt_required()
def remove_event(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    user_id = get_jwt_identity()
    if user_id != event.owner_id:
        return jsonify({"msg": "Cant delete this event"}), 400
    db.session.delete(event)
    db.session.commit()
    return jsonify({"msg": "Event has been removed"}), 200


@api.route("/event/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event():
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    name = request.json.get("name", None)
    if name is None:
        return jsonify({"msg": "Need a name to register an event"}), 401
    event_name_exists = Event.query.filter_by(name=name).first()
    if event_name_exists is not None:
        return jsonify({"msg": "Name already taken"}), 401
    start = request.json.get("start", None)
    if start is None:
        return jsonify({"msg": "Need a start to register an event"}), 401
    end = request.json.get("end", None)
    if end is None:
        return jsonify({"msg": "Need an end to register an event"}), 401
    owner_id = get_jwt_identity()
    date = request.json.get("date", None)
    if date is None:
        return jsonify({"msg": "Need a date to register an event"}), 401
    private = request.json.get("private", None)
    if private is None:
        return jsonify({"msg": "Undeclared group privacy"}), 401
    slug = slugify(name)
    description = request.json.get("description", None)

    event["name"] = name,
    event["start"] = start,
    event["end"] = end,
    event["owner_id"] = owner_id,
    event["date"] = date,
    event["private"] = private,
    event["slug"] = slug,
    event["description"] = description

    db.session.commit()
    return jsonify(event.serialize()), 200
