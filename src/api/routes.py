"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Group
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql import text
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, get_jwt

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
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id}), 200


@api.route("/group", methods=["POST"])
@jwt_required()
def post_group():
    name = request.json.get("name", None)
    private = request.json.get("private", None)

    group = Group.query.filter_by(name=name).first()

    owner_id = get_jwt_identity()  # aqui ya tengo el token

    if group is not None:
        return jsonify({"msg": "that name already exists"}), 404

    if name is None or private is None:
        return jsonify({"msg": "badly created group"}), 404

    private = bool(private)

    if private is not True and not False:

        return jsonify({"msg": "undeclared group privacy"})

    new_group = Group(
        owner_id=owner_id,
        name=name,
        private=private,
    )

    db.session.add(new_group)
    db.session.commit()
    return jsonify(new_group.serialize()), 200


@api.route("/group", methods=["PUT"])
@jwt_required()
def update_group():
    name = request.json.get("name", None)
    data = request.get_json()
    private = request.json.get("private", None)
    owner_id = get_jwt_identity(),
    group = Group.query.filter_by(owner_id=owner_id).first()
    if data["name"] is not None:
        group.name = data["name"]
    if data["private"] is not None:
        group.private = data["private"]

    db.session.commit()
    return jsonify(group.serialize()), 200


@api.route('/group', methods=['GET'])
def get_groups():
    groups = Group.query.all()
    serializer = list(map(lambda x: x.serialize(), groups))
    return jsonify({"data": serializer}), 200


@api.route("/group/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_group(id):
    ##HACER PUT Y GET ##

    group = Group.query.get(id)
    owner_id = get_jwt_identity()
    if owner_id != group.owner_id:
        return jsonify({"msg": "you can´t delete this group"}), 404
    db.session.delete(group)
    db.session.commit()

    return jsonify({"msg": "group has been deleted"}), 200
