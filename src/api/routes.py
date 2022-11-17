"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import datetime
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, User_Data, Group, Image, Post, Group_participation, Event_participation, Form_friendship, Event_comments, Post_comments
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
#                            CRUD de user/friend                                      #
################################################################################

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    allUsers = User.query.all()
    serializer = list(map(lambda x: x.serialize(), allUsers))
    print(allUsers)
    if allUsers is None:
        return({"msg":"bad request"})  
    return jsonify({"data": serializer}), 200






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
    print(date)
    origin_lon = request.json.get("origin_lon", None)
    if origin_lon is None:
        return jsonify({"msg": "Need a origin_lon to register an event"}), 401
    origin_lat = request.json.get("origin_lat", None)
    if origin_lat is None:
        return jsonify({"msg": "Need a origin_lat to register an event"}), 401
    destination_lon = request.json.get("destination_lon", None)
    if destination_lon is None:
        return jsonify({"msg": "Need a destination_lon to register an event"}), 401
    destination_lat = request.json.get("destination_lat", None)
    if destination_lat is None:
        return jsonify({"msg": "Need a destination_lat to register an event"}), 401
    slug = slugify(name)
    description = request.json.get("description", None)
    hours = request.json.get("hours", None)
    if hours is None:
        return jsonify({"msg": "Need hours to register an event"}), 401
    hours = int(hours)
    minutes = request.json.get("minutes", None)
    if minutes is None:
        return jsonify({"msg": "Need minutes to register an event"}), 401
    minutes = int(minutes)
    slug = slugify(name)

    new_event = Event(
        name=name,
        start=start,
        end=end,
        owner_id=owner_id,
        private=False,
        date=date,
        slug=slug,
        description=description,
        map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97173.78941670264!2d-3.7495758376144654!3d40.4380638218829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sMadrid!5e0!3m2!1sen!2ses!4v1667475409979!5m2!1sen!2ses",
        origin_lon=origin_lon,
        origin_lat=origin_lat,
        destination_lon=destination_lon,
        destination_lat=destination_lat,
        hours=hours,
        minutes=minutes
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
    event_to_delete = Event.query.get(event_id)
    if event_to_delete is None:
        return jsonify({"msg": "Event not found"}), 404
    user_id = get_jwt_identity()
    if user_id != event_to_delete.owner_id:
        return jsonify({"msg": "Cant delete this event"}), 400
    eventsParticipation = Event_participation.query.filter_by(
        event_id=event_id).all()
    for event_part in eventsParticipation:
        db.session.delete(event_part)
        db.session.commit()
    comments_to_delete = Event_comments.query.filter_by(
        event_id=event_id).all()
    for comment in comments_to_delete:
        db.session.delete(comment)
        db.session.commit()
    db.session.delete(event_to_delete)
    db.session.commit()
    return jsonify({"msg": "Event has been removed"}), 200


@api.route("/event/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event(event_id):
    event = Event.query.get(event_id)
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
    print(date)
    origin_lon = request.json.get("origin_lon", None)
    if origin_lon is None:
        return jsonify({"msg": "Need a origin_lon to register an event"}), 401
    origin_lat = request.json.get("origin_lat", None)
    if origin_lat is None:
        return jsonify({"msg": "Need a origin_lat to register an event"}), 401
    destination_lon = request.json.get("destination_lon", None)
    if destination_lon is None:
        return jsonify({"msg": "Need a destination_lon to register an event"}), 401
    destination_lat = request.json.get("destination_lat", None)
    if destination_lat is None:
        return jsonify({"msg": "Need a destination_lat to register an event"}), 401
    slug = slugify(name)
    description = request.json.get("description", None)

    event.name = name,
    event.start = start,
    event.end = end,
    event.date = date,
    event.slug = slug,
    event.description = description

    db.session.commit()
    return jsonify(event.serialize()), 200


@api.route("/events/<int:page>/<int:per_page>", methods=["GET"])
@jwt_required()
def get_events(page, per_page):
    user_id = get_jwt_identity()
    amount_participation = Event_participation.query.filter_by(
        user_id=user_id).count()
    all_events = Event_participation.query.order_by(Event_participation.id.desc()).filter_by(
        user_id=user_id).paginate(page=page, per_page=per_page)

    all_events = list(map(lambda x: x.return_event(), all_events))

    if all_events is None:
        return jsonify({"msg": "Event not found"}), 404
    return jsonify(all_events, amount_participation)


@api.route("/publicevents/<int:page>/<int:per_page>", methods=["GET"])
def get_public_events(page, per_page):

    amount_events = Event.query.count()
    all_events = Event.query.order_by(
        Event.id.desc()).paginate(page=page, per_page=per_page)

    all_events = list(map(lambda x: x.serialize(), all_events))

    if all_events is None:
        return jsonify({"msg": "Events not found"}), 404
    return jsonify(all_events, amount_events)


@api.route("/eventmap/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event_map(event_id):
    user_id = get_jwt_identity()
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    if event.owner_id != user_id:
        return jsonify({"msg": "You are not the owner of the event"}), 404
    map = request.json.get("map", None)
    if map is None:
        return jsonify({"msg": "Need a map to register an event"}), 401

    event.map = map

    db.session.commit()
    return jsonify(event.serialize()), 200


@api.route("/joinevent", methods=["POST"])
@jwt_required()
def join_event():
    user_id = get_jwt_identity()
    event_id = request.json.get("event_id", None)
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    check = Event_participation.query.filter_by(
        user_id=user_id).filter_by(event_id=event_id).first()
    if check is not None:
        return jsonify({"msg": "Already joined"}), 404
    new_participant = Event_participation(
        user_id=user_id,
        event_id=event_id
    )
    db.session.add(new_participant)
    db.session.commit()
    return jsonify({"msg": "Joined the group"}), 200


@api.route("/myevents", methods=["GET"])
@jwt_required()
def list_event():
    user_id = get_jwt_identity()
    all_events = Event_participation.query.order_by(Event_participation.id.desc()).filter_by(
        user_id=user_id).all()
    all_events = list(map(lambda x: x.serialize(), all_events))
    return jsonify(all_events), 200


@api.route("/unsubscribeevent", methods=["DELETE"])
@jwt_required()
def leave_event():
    user_id = get_jwt_identity()
    event_id = request.json.get("event_id", None)
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    check = Event_participation.query.filter_by(
        user_id=user_id).filter_by(event_id=event_id).first()
    if check is None:
        return jsonify({"msg": "Not joined"}), 404

    db.session.delete(check)
    db.session.commit()
    return jsonify({"msg": "Left the group"}), 200


@api.route("/searchevent/<name>/<start>/<end>/<date>/<int:page>", methods=["GET"])
def search_event(name, start, end, date, page):
    searchQuery = ""
    if name != "any":
        searchQuery = ".filter_by(name = name)"
    if start != "any":
        start.replace("%", " ")
        searchQuery = searchQuery + ".filter_by(start = start)"
    if end != "any":
        end.replace("%", " ")
        searchQuery = searchQuery + ".filter_by(end = end)"
    if date != "any":
        date.replace("%", " ")
        searchQuery = searchQuery + ".filter_by(date = date)"
    per_page = 5
    amount_participation = eval(
        "Event.query.order_by(Event.id.desc())"+searchQuery+".count()")
    all_events = eval("Event.query.order_by(Event.id.desc())" +
                      searchQuery+".paginate(page=page, per_page=per_page)")
    all_events = list(map(lambda x: x.serialize(), all_events))
    return jsonify(all_events, amount_participation), 200


@api.route("/listParticipants/<int:event_id>", methods=["GET"])
def list_participants(event_id):
    all_participants = Event_participation.query.order_by(Event_participation.id.desc()).filter_by(
        event_id=event_id).count()
    return jsonify({"participantsAmount": all_participants}), 200


################################################################################
#                           POST CRUD                                          #
################################################################################


@api.route("/all_posts/<int:page>/<int:per_page>", methods=["GET"])
@jwt_required()
def get_all_post(page, per_page):
    post_array = []
    count_all_posts = Post.query.count()

    if count_all_posts == 0:
        return jsonify({"msg": "There is not post"}), 404

    all_post = Post.query.order_by(Post.id.desc()).paginate(
        page=page, per_page=per_page)

    all_post = list(map(lambda x: x.serialize_image(), all_post))

    return jsonify(all_post, count_all_posts), 200


@api.route("/all_user_posts", methods=["GET"])
@jwt_required()
def get_by_user():
    current_user_id = get_jwt_identity()
    post_array = []
    all_post = Post.query.filter_by(
        user_id=current_user_id).order_by(Post.id.desc()).all()
    if len(all_post) == 0:
        return jsonify({"msg": "You don't have any posts"}), 404

    all_post = list(map(lambda x: x.serialize_image(), all_post))

    return jsonify(all_post), 200


@api.route("/create_post", methods=["POST"])
@jwt_required()
def create_post():
    text = request.json.get("text", None)
    image = request.json.get("image", None)
    current_user_id = get_jwt_identity()

    new_post = Post(
        text=text,
        image_id=image,
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
        if image.startswith("data:image"):
            current_image = Image(
                owner_id=current_user_id,
                image=image
            )
            db.session.add(current_image)
            db.session.commit()
            post_exist.image = current_image.id
        else:
            post_exist = image

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

    if current_user_id != post_deleted.user_id:
        return jsonify({"msg": "Not the owner of the post"}), 400

    comments_to_delete = Post_comments.query.filter_by(post_id=post_id).all()
    for comment in comments_to_delete:
        db.session.delete(comment)
        db.session.commit()

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


@api.route("/user/images/<int:page>/<int:per_page>", methods=["GET"])
@jwt_required()
def get_images(page, per_page):
    user_id = get_jwt_identity()
    amount_all_images = Image.query.filter_by(
        owner_id=user_id).count()
    all_images = Image.query.filter_by(
        owner_id=user_id).paginate(page=page, per_page=per_page)

    all_images = list(map(lambda x: x.serialize(), all_images))
    if all_images is None:
        return jsonify({"msg": "There are no images"}), 404
    return jsonify(all_images, amount_all_images)


@api.route("/user/image_by_user", methods=["GET"])
@jwt_required()
def get_profile_picture_by_user():
    current_user_id = get_jwt_identity()
    data = User_Data.query.filter_by(user_id=current_user_id).first()
    image_profile_user = Image.query.get(data.profile_picture)
    if image_profile_user is None:
        return jsonify({"msg": "this user has not profile picture yet"}), 400
    return jsonify({"data": image_profile_user.serialize()}), 200


@api.route("/user/image/<int:id>", methods=["GET"])
@jwt_required()
def get_profile_picture(id):
    image_profile_user = Image.query.get(id)
    if image_profile_user is None:
        return jsonify({"msg": "this user has not profile picture yet"}), 400
    return jsonify({"data": image_profile_user.serialize()}), 200


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
    current_user_id = get_jwt_identity()
    image = Image.query.get(id)
    if image is None:
        return jsonify({"msg": "no picture to delete"}), 400
    if image.owner_id != current_user_id:
        return jsonify({"msg": "not the user"}), 400
    checkPost = Post.query.filter_by(image_id=id).first()
    if checkPost is not None:
        return jsonify({"msg": "delete the post before"}), 401
    db.session.delete(image)
    db.session.commit()
    return jsonify({"msg": "picture has been erased"}), 200


################################################################################
#                           CRUD de Comentarios                                  #
################################################################################

@api.route("/listEventComments/<int:event_id>", methods=["GET"])
def list_event_comments(event_id):
    all_comments = Event_comments.query.order_by(Event_comments.id.asc()).filter_by(
        event_id=event_id).all()
    all_comments = list(map(lambda x: x.serialize(), all_comments))
    return jsonify(all_comments), 200


@api.route("/listEventComments", methods=["POST"])
@jwt_required()
def new_event_comment():
    user_id = get_jwt_identity()
    event_id = request.json.get("item_id", None)
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    comment = request.json.get("comment", None)
    if comment is None:
        return jsonify({"msg": "No comment found"}), 404
    comment_to_save = Event_comments(
        user_id=user_id,
        event_id=event_id,
        comment=comment
    )
    db.session.add(comment_to_save)
    db.session.commit()

    return jsonify(comment_to_save.serialize()), 200


@api.route("/listPostComments/<int:post_id>", methods=["GET"])
def list_post_comments(post_id):
    all_comments = Post_comments.query.order_by(Post_comments.id.asc()).filter_by(
        post_id=post_id).all()
    if all_comments == None:
        return jsonify([], 0), 200

    all_comments = list(map(lambda x: x.serialize(), all_comments))
    return jsonify(all_comments), 200


@api.route("/listPostComments", methods=["POST"])
@jwt_required()
def new_post_comment():
    user_id = get_jwt_identity()
    post_id = request.json.get("item_id", None)

    post = Post.query.get(post_id)
    if post is None:
        return jsonify({"msg": "Post not found"}), 404
    comment = request.json.get("comment", None)
    if comment is None:
        return jsonify({"msg": "No comment found"}), 404
    comment_to_save = Post_comments(
        user_id=user_id,
        post_id=post_id,
        comment=comment
    )
    db.session.add(comment_to_save)
    db.session.commit()

    return jsonify(comment_to_save.serialize()), 200
