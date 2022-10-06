"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, User_Data, Post
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
#                           POST CRUD                                          #
################################################################################

@api.route("/all_posts", methods=["GET"])
@jwt_required()
def get_all_post():

    post_array = []
    
    all_post = Post.query.all()

    if all_post is None:
        return jsonify({"msg": "There is not post"}), 404
    
    for post in all_post:
       post_array.append(post)

    return jsonify([Post.serialize(post) for post in all_post]),200

@api.route("/all_user_posts", methods=["GET"])
@jwt_required()
def get_by_user():
    current_user_id = get_jwt_identity()
    post_array = []
    
    all_post = Post.query.filter_by(user_id = current_user_id)

    if all_post is None:
        return jsonify({"msg": "You don't have any posts"}), 404
    
    for post in all_post:
       post_array.append(post)

    return jsonify([Post.serialize(post) for post in all_post]),200


@api.route("/create_post", methods=["POST"])
@jwt_required()
def create_post():
    text =  request.json.get("text", None)
    image =  request.json.get("image", None)
    current_user_id = get_jwt_identity()

    new_post = Post(
        text = text,
        image = image,
        user_id = current_user_id
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(Post.serialize(new_post)),200

@api.route("/update_post", methods=["PUT"])
@jwt_required()
def update_post():
    current_user_id = get_jwt_identity()
    id =  request.json.get("id", None)
    text =  request.json.get("text", None)
    image =  request.json.get("image", None)

    post_exist = Post.query.filter_by(id = id).first()

    if post_exist is None:
         return jsonify({"msg": "The post doesn't exist!"}), 404

    if text is not None:
       post_exist.text = text
    if image is not None:
        post_exist.image = image

    db.session.commit()
    return jsonify(Post.serialize(post_exist)),200

@api.route("/delete_post", methods=["DELETE"])
@jwt_required()
def delete_post():
    post_id = request.json.get("id", None)
    current_user_id = get_jwt_identity()

    if post_id is None:
        return jsonify({"msg": "Post ID is required!"}), 404

    post_deleted = Post.query.filter_by(user_id = current_user_id).first()

    if post_deleted is None:
        return jsonify({"msg": "The post is already deleted!"}), 404

    db.session.delete(post_deleted)
    db.session.commit()
    return jsonify({"msg":"post deleted"}),200

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
        profile_picture = None
    )
    if data["profile_picture"] is not None:
        new_user_data["profile_picture"] = data["profile_picture"]
    db.session.add(new_user_data)
    db.session.commit()
    return jsonify(new_user_data.serialize()),200

@api.route("/updateuserdata", methods=["PUT"])
@jwt_required()
def update_user_data():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id = current_user_id).first()
    if data["name"] is not None:
        current_user.name = data["name"]
    if data["last_name"] is not None:
        current_user.last_name = data["last_name"]
    if data["address"] is not None:
        current_user.address = data["address"]
    if data["profile_picture"] is not None:
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