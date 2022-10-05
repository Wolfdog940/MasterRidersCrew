
import os
from flask_admin import Admin
from .models import db, User, Group, User_Data, Image ,Post
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Post, db.session))
    admin.add_view(ModelView(Group, db.session))
    admin.add_view(ModelView(User_Data, db.session))
    admin.add_view(ModelView(Image, db.session))


   
