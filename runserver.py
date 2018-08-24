"""
This script runs the card_app application using a development server.
"""

from os import environ
from card_app import app

if __name__ == '__main__':
    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '65000'))
    except ValueError:
        PORT = 65000
    app.run(HOST, PORT)