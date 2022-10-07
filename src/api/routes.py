"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, User_Data, Image
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql import text
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, get_jwt

api = Blueprint('api', __name__)

## REVISAR PARA BORRAR TODAS LAS FUNCIONES QUE VENIAN EN EL boilerplate ##
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

################################################################################
#                                   signup                                     #
################################################################################

@api.route("/signup", methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None:
        return jsonify({"msg": "Email is missing, write one, please!"}), 404
    if password is None:
        return jsonify({"msg": "Password is missing, write one, please!"}), 404
    user = User.query.filter_by(email = email).first()
    if user is not None:
        return jsonify({"msg": "Sorry. User already exist!"}), 409
    new_user = User(
        email = email,
        password = password,
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 200

################################################################################
#                                   Login                                      #
################################################################################

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id}), 200

################################################################################
#                           CRUD de User_Data                                  #
################################################################################

@api.route("/userdatainfo", methods=["GET"])
@jwt_required()
def get_user_data():
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id = current_user_id).first()
    if current_user is None:
        return jsonify({"msg": "The user does not exist"}), 400
    return jsonify(current_user.serialize()),200

@api.route("/setuserdata", methods=["POST"])
@jwt_required()
def post_user_data():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_user_data = User_Data(
        name = data["name"],
        last_name = data["last_name"],
        address = data["address"],
        user_id = current_user_id,
        profile_picture = None      #Por defecto dejo se crea sin profile_picture
    )
    db.session.add(new_user_data)
    db.session.commit()
    return jsonify(new_user_data.serialize()),200

@api.route("/updateuserdata", methods=["PUT"])
@jwt_required()
def update_user_data():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id = current_user_id).first()
    keys = list(data.keys())
    if "name" in keys:
        current_user.name = data["name"]
    if "last_name" in keys:
        current_user.last_name = data["last_name"]
    if "address" in keys:
        current_user.address = data["address"]
    if "profile_picture" in keys:
        current_user.profile_picture = data["profile_picture"]
    db.session.commit()
    return jsonify(current_user.serialize()),200

@api.route("/deleteuserdata", methods=["DELETE"])
@jwt_required()
def delete_user_data():
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id = current_user_id).first()
    if current_user is None:
        return jsonify({"msg":"no user data to delete"}),400
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({"msg":"data has been erased"}),200

################################################################################
#                           CRUD de Image                                      #
################################################################################

@api.route("/allimagesuser", methods=["GET"])
@jwt_required()
def get_all_image_user():
    current_user_id = get_jwt_identity()
    images_user = Image.query.filter_by(owner_id = current_user_id).all()
    if len(images_user) == 0:
        return jsonify({"msg": "this user has not images yet"}),400
    serializer = list(map(lambda picture: picture.serialize(), images_user))
    return jsonify({"data": serializer}),200


## Estoy asumiendo que la image ya me viene en base64 y es lo que estoy guardando
@api.route("/setimageuser", methods=["POST"])
@jwt_required()
def post_image():
    current_user_id = get_jwt_identity()
    image = request.json.get("image", None)
    if image is None:
        return jsonify({"msg": "no picture to upload"}),400
    current_image = Image(
        owner_id = current_user_id,
        image = image
    )
    db.session.add(current_image)
    db.session.commit()
    return jsonify({"msg": "the picture has been uploaded"}),200

@api.route("/deleteimageuser/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_image(id):
    image = Image.query.get(id)
    if image is None:
        return jsonify({"msg": "no picture to delete"})
    db.session.delete(image)
    db.session.commit()
    return jsonify({"msg": "picture has been erased"}),200
    