"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql import text
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity,
    create_access_token,get_jwt
)

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



@api.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=data.get("email")).first()
    if user is not None:
        return jsonify({"message": "El usuario ya existe"}), 409
    if not email:
        return jsonify({"message": "Escriba un Email"}), 404
    elif not password:
        return jsonify({"message": "Escriba una Contraseña"}), 404

    new_user = User(
        email=data.get("email"),
        password=data.get("password"),
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

