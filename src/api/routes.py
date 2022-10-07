"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Event, User_Data
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

################################################################################
#                           CRUD de Event                                      #
################################################################################


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
    """ date = request.json.get("date", None)
    if date is None:
        return jsonify({"msg": "Need a date to register an event"}), 401 """
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
    """ date = request.json.get("date", None)
    if date is None:
        return jsonify({"msg": "Need a date to register an event"}), 401 """
    private = request.json.get("private", None)
    if private is None:
        return jsonify({"msg": "Undeclared group privacy"}), 401
    slug = slugify(name)
    description = request.json.get("description", None)

    event["name"] = name,
    event["start"] = start,
    event["end"] = end,
    event["owner_id"] = owner_id,
    """ event["date"] = date, """
    event["private"] = private,
    event["slug"] = slug,
    event["description"] = description

    db.session.commit()
    return jsonify(event.serialize()), 200

################################################################################
#                           CRUD de User_Data                                  #
################################################################################


@api.route("/userdatainfo", methods=["GET"])
@jwt_required()
def get_user_data():
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id=current_user_id).first()
    if current_user is None:
        return jsonify({"msg": "The user does not exist"}), 400
    return jsonify(current_user.serialize()), 200


@api.route("/setuserdata", methods=["POST"])
@jwt_required()
def post_user_data():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_user_data = User_Data(
        name=data["name"],
        last_name=data["last_name"],
        address=data["address"],
        user_id=current_user_id,
        profile_picture=None
    )
    if data["profile_picture"] is not None:
        new_user_data["profile_picture"] = data["profile_picture"]
    db.session.add(new_user_data)
    db.session.commit()
    return jsonify(new_user_data.serialize()), 200


@api.route("/updateuserdata", methods=["PUT"])
@jwt_required()
def update_user_data():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id=current_user_id).first()
    if data["name"] is not None:
        current_user.name = data["name"]
    if data["last_name"] is not None:
        current_user.last_name = data["last_name"]
    if data["address"] is not None:
        current_user.address = data["address"]
    if data["profile_picture"] is not None:
        current_user.profile_picture = data["profile_picture"]
    db.session.commit()
    return jsonify(current_user.serialize()), 200


@api.route("/deleteuserdata", methods=["DELETE"])
@jwt_required()
def delete_user_data():
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id=current_user_id).first()
    if current_user is None:
        return jsonify({"msg": "no user data to delete"}), 400
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({"msg": "data has been erased"}), 200

################################################################################
#                           CRUD de Image                                      #
################################################################################
