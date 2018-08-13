"""
The flask application package.
"""

from flask import Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = '7d441f27d441f27567d441f2b6176a'
app.config.from_object(__name__)
app.config['DEBUG'] = True
import card_app.views
