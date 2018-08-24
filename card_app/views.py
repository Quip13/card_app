"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import Flask, render_template, flash, request, render_template
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField
from card_app import app

class Basics(Form):
    name = TextField('Name:', [
        validators.DataRequired(message='Name is a required field'),
        validators.Regexp('^(?!Calvin).*$',message='ERRRR Cannot be Calvin'),
        validators.Regexp('^(?!Katherine).*$',message='ERRRR NO POTATO')])


@app.route("/form", methods=['GET', 'POST'])
def form():
    form = Basics(request.form)

    print (form.errors)
    if request.method == 'POST':
        name=request.form['name']
        print (name)

        if form.validate():
            flash('Hello ' + name)
        else:
            for fieldName, errorMessages in form.errors.items():
                for err in errorMessages: flash(err)

    return render_template('form.html', form=form)

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Calvin'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Cardiology App'
    )
