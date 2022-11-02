"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import datetime
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, User_Data, Group, Image, Post, Group_participation, Event_participation, Form_friendship
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql import text
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, get_jwt
from slugify import slugify

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

################################################################################
#                                   Login                                      #
################################################################################


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
    access_token = create_access_token(
        identity=user.id, expires_delta=datetime.timedelta(days=10))
    return jsonify({"token": access_token, "user_id": user.id}), 200

################################################################################
#                            CRUD de group                                      #
################################################################################


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
    print(new_group)
    db.session.add(new_group)
    db.session.commit()
    return jsonify(new_group.serialize()), 200


@api.route("/group/<int:id>", methods=["PUT"])
@jwt_required()
def update_group(id):
    data = request.get_json()
    owner_id = get_jwt_identity()
    keys = list(data.keys())
    group = Group.query.get(id)

    if owner_id != group.owner_id:
        return jsonify({"msg": "you can´t upgrade this group"}), 404

    if "name" in keys:
        group.name = data["name"]
    if "private" in keys:
        group.private = data["private"]

    return jsonify(group.serialize()), 200


@api.route('/group', methods=['GET'])
@jwt_required()
def get_groups():
    groups = Group.query.all()
    serializer = list(map(lambda x: x.serialize(), groups))

    return jsonify({"data": serializer}), 200


@api.route('/user/group', methods=['GET'])
@jwt_required()
def get_group_by_user_id():
    owner_id = get_jwt_identity()
    my_groups = Group.query.filter_by(
        owner_id=owner_id).all()  # lista de objetos
    all_my_groups = Group_participation.query.filter_by(
        user_id=owner_id).all()
    all_my_groups = list(
        map(lambda x: Group.query.get(x.group_id), all_my_groups))  # lista all_my groups y ejecuta el lamda
    all_groups = my_groups + all_my_groups

    serializer = list(map(lambda x: x.serialize_name(), all_groups))

    return jsonify({"data": serializer}), 200


# esto es para apuntarme un grupo
@api.route('/user/participation', methods=['POST'])
@jwt_required()
def join_group():
    user_id = get_jwt_identity()

    data = request.get_json()
    if "group_id" not in data:
        return jsonify({"msg": "no has enviado ningun grupo"}), 401

    new_participant = Group_participation(
        user_id=user_id,
        group_id=data["group_id"]

    )
    db.session.add(new_participant)

    db.session.commit()

    return jsonify(new_participant.serialize())


# enpoint que haga una busqueda de todos mis grupos ,


@api.route("/group/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_group(id):

    group = Group.query.get(id)
    owner_id = get_jwt_identity()
    if owner_id != group.owner_id:
        return jsonify({"msg": "you can´t delete this group"}), 404
    if group is None:
        return jsonify({"msg": "Group does not exist"}), 402
    db.session.delete(group)
    db.session.commit()

    return jsonify({"msg": "group has been deleted"}), 200

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
    date = request.json.get("date", None)
    if date is None:
        return jsonify({"msg": "Need a date to register an event"}), 401
    slug = slugify(name)
    description = request.json.get("description", None)

    new_event = Event(
        name=name,
        start=start,
        end=end,
        owner_id=owner_id,
        private=False,
        date=date,
        slug=slug,
        description=description,
        map="https://embed.waze.com/iframe?zoom=13&lat=40.4168&lon=-3.7038&pin=1"
    )

    db.session.add(new_event)
    db.session.commit()
    new_event = new_event.serialize()
    new_participant = Event_participation(
        user_id=owner_id,
        event_id=new_event["id"]
    )
    db.session.add(new_participant)
    db.session.commit()
    return jsonify(new_event), 200


@api.route("/event/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    return jsonify(event.serialize()), 200


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
def update_event(event_id):
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
    slug = slugify(name)
    description = request.json.get("description", None)

    event["name"] = name,
    event["start"] = start,
    event["end"] = end,
    event["date"] = date,
    event["slug"] = slug,
    event["description"] = description

    db.session.commit()
    return jsonify(event.serialize()), 200


@api.route("/events/<int:page>/<int:per_page>", methods=["GET"])
@jwt_required()
def get_events(page, per_page):
    user_id = get_jwt_identity()
    amount_participation = Event_participation.query.filter_by(
        user_id=user_id).count()
    all_events = Event_participation.query.filter_by(
        user_id=user_id).paginate(page=page, per_page=per_page)

    all_events = list(map(lambda x: x.return_event(), all_events))

    if all_events is None:
        return jsonify({"msg": "Event not found"}), 404
    return jsonify(all_events, amount_participation)


@api.route("/publicevents/<int:page>/<int:per_page>", methods=["GET"])
def get_public_events(page, per_page):

    amount_events = Event.query.count()
    all_events = Event.query.paginate(page=page, per_page=per_page)

    all_events = list(map(lambda x: x.serialize(), all_events))

    if all_events is None:
        return jsonify({"msg": "Events not found"}), 404
    return jsonify(all_events, amount_events)


@api.route("/eventmap/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event_map(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    map = request.json.get("map", None)
    if map is None:
        return jsonify({"msg": "Need a map to register an event"}), 401

    event.map = map

    db.session.commit()
    return jsonify(event.serialize()), 200

################################################################################
#                           POST CRUD                                          #
################################################################################


@api.route("/all_posts", methods=["GET"])
@jwt_required()
def get_all_post():

    post_array = []

    all_post = Post.query.order_by(Post.id.desc()).all()

    if len(all_post) == 0:
        return jsonify({"msg": "There is not post"}), 404

    for post in all_post:
        post_array.append(post)

    return jsonify([Post.serialize(post) for post in all_post]), 200


@api.route("/all_user_posts", methods=["GET"])
@jwt_required()
def get_by_user():
    current_user_id = get_jwt_identity()
    post_array = []
    all_post = Post.query.filter_by(user_id=current_user_id).all()
    if len(all_post) == 0:
        return jsonify({"msg": "You don't have any posts"}), 404

    for post in all_post:
        post_array.append(post)

    return jsonify([Post.serialize(post) for post in all_post]), 200


@api.route("/create_post", methods=["POST"])
@jwt_required()
def create_post():
    text = request.json.get("text", None)
    image = request.json.get("image", None)
    current_user_id = get_jwt_identity()

    new_post = Post(
        text=text,
        image=image,
        user_id=current_user_id
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(Post.serialize(new_post)), 200


@api.route("/update_post", methods=["PUT"])
@jwt_required()
def update_post():
    current_user_id = get_jwt_identity()
    id = request.json.get("id", None)
    text = request.json.get("text", None)
    image = request.json.get("image", None)

    post_exist = Post.query.filter_by(id=id).first()

    if post_exist is None:
        return jsonify({"msg": "The post doesn't exist!"}), 404

    if text is not None:
        post_exist.text = text
    if image is not None:
        post_exist.image = image

    db.session.commit()
    return jsonify(Post.serialize(post_exist)), 200


@api.route("/delete_post", methods=["DELETE"])
@jwt_required()
def delete_post():
    post_id = request.json.get("id", None)
    current_user_id = get_jwt_identity()

    if post_id is None:
        return jsonify({"msg": "Post ID is required!"}), 404

    post_deleted = Post.query.filter_by(id=post_id).first()

    if post_deleted is None:
        return jsonify({"msg": "The post is already deleted!"}), 404

    db.session.delete(post_deleted)
    db.session.commit()
    return jsonify({"msg": "post deleted"}), 200

################################################################################
#                           CRUD de User_Data                                  #
################################################################################


@api.route("/user/data/info", methods=["GET"])
@jwt_required()
def get_user_data():
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id=current_user_id).first()
    if current_user is None:

        return jsonify({"msg": "The user data does not exist"}), 400
    return jsonify(current_user.serialize()), 200


@api.route("/user/<int:id>/data", methods=["POST"])
def post_user_data(id):
    data = request.get_json()
    new_user_data = User_Data(
        name=data["name"],
        last_name=data["last_name"],
        address=None,
        user_id=id,
        profile_picture=None  # Por defecto dejo se crea sin profile_picture
    )
    db.session.add(new_user_data)
    db.session.commit()
    return jsonify(new_user_data.serialize()), 200


@api.route("/user/data/update", methods=["PUT"])
@jwt_required()
def update_user_data():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    current_user = User_Data.query.filter_by(user_id=current_user_id).first()
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
    return jsonify(current_user.serialize()), 200


@api.route("/user/data/delete", methods=["DELETE"])
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


@api.route("/user/image/all", methods=["GET"])
@jwt_required()
def get_all_image_user():
    current_user_id = get_jwt_identity()
    images_user = Image.query.filter_by(owner_id=current_user_id).all()
    if len(images_user) == 0:
        return jsonify({"msg": "this user has not images yet"}), 400
    serializer = list(map(lambda picture: picture.serialize(), images_user))
    return jsonify({"data": serializer}), 200


@api.route("/user/image/<int:id>", methods=["GET"])
@jwt_required()
def get_profile_picture(id):
    image_profile_user = Image.query.get(id)
    if image_profile_user is None:
        return jsonify({"msg": "this user has not profile picture yet"}), 400
    return jsonify({"data": image_profile_user.serialize()}), 200

# Estoy asumiendo que la image ya me viene en base64 y es lo que estoy guardando


@api.route("/user/image", methods=["POST"])
@jwt_required()
def post_image():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if data is None:
        return jsonify({"msg": "no picture to upload"}), 400
    current_image = Image(
        owner_id=current_user_id,
        image=data
    )
    db.session.add(current_image)
    db.session.commit()
    return jsonify({"data": current_image.serialize()}), 200


@api.route("/user/image/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_image(id):
    image = Image.query.get(id)
    if image is None:
        return jsonify({"msg": "no picture to delete"})
    db.session.delete(image)
    db.session.commit()
    return jsonify({"msg": "picture has been erased"}), 200
