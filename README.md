# Recipes
> In this project I worked on creating a recipe website using Django framework. 

## Table of contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Files & Directories](#files-directories)
* [Justification](#justification)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info
The purpose of this project is to design a recipe website, where the users can share their favourite recipes. 

## Screenshots
![Screenshot1](https://user-images.githubusercontent.com/61382735/110971790-96312d80-835b-11eb-8995-9409cc95f56a.png)
![Screenshot2](https://user-images.githubusercontent.com/61382735/110971883-b234cf00-835b-11eb-94a0-b468bc0de2f4.png)
![Screenshot3](https://user-images.githubusercontent.com/61382735/110971883-b234cf00-835b-11eb-94a0-b468bc0de2f4.png)

## Technologies
* Python - version 3.6
* Django - version 3.1
* Gunicorn - version 20.0
* Postgres - version 12.4
* Bootstrap4

## Setup
```
python3 -m venv myvenv
source myvenv/bin/activate
pip install -r requirements.txt
```

Create .env file such as: 
```
POSTGRES_ENGINE=django.db.backends.postgresql_psycopg2
POSTGRES_NAME=<your_postgres_name>
POSTGRES_USER=<your_postgres_username>
POSTGRES_PASSWORD=<your_postgres_password>
POSTGRES_HOST=<your_postgres_url>
POSTGRES_PORT=<your_postgres_port>
DJANGO_SECRET_KEY=<your_django_secret_key>
```

```
python manage.py makemigrations recipes
python manage.py migrate
python manage.py runserver

```
See your website at:
[http://127.0.0.1:8000](http://127.0.0.1:8000)

## Features
* View other users' recipes, add those you like to your recipe book to simpify the later search 
* Add recipes' ingredients into the shopping list, so that you can have it ready for the whole menu
* Being able to use the timer for each cooking step and run them simultaneously if needed

To-do list:
* improve design 
* add more functionalities 

## Files and directories
- `Main Directory (final_project)` 
    - `capstone` - Updated the project settings and the main url file.
        - `.env` - 

    - `recipes` - recipes app directory.
        - `models.py` - Contains models that keep information about users and recipes, users' preferences. In addition, there are methods for serializing data
        - `urls.py` - Consits of app urls and api routes 
        - `views.py` - There are not only view functions, but also GET and PUT requests functions as well as view functions for authentication(like login, register and logout)
    
        - `static` - Holds all static files.
            - `styles.css` - style rules for the project
            - `form.js` - contains functions for manipulating the form
            - `index.js` - holds all functions for manipulation the DOM
            - `Information_Block.ogg` - timer sound
        - `Templates` - contains all html files (in particular, edit.html holds the form for creating a new recipe)
    - `media` - directory that holds images of dishes
    - `gitignore` - Files to ignore for git
    - `requirements.txt` - packages required to run the web-sitr
    - `Procfile` - file for deploying on Heroku

#### Justification
    There are a couple of new functionalities I can't but mention that make this project distinct from all previous projects:
        - More models with more complex relations, duration field and image field usage
        - Uploading media files into database
        - Uses django formsets for recipe ingredients and instructions
        - moment.js package usage
        - Audio object usage
        - Completely Mobile responsive.


## Status
Project is paused, because it fullfills the requirements of the course, but some changes to be done to improve functionality and design.

## Inspiration
This project is part of the Harvard course I am taking, in particular CS50’s Web Programming with Python and JavaScript, final project 

## Contact
Created by [Lena Struts](https://www.linkedin.com/in/lena-yeliena-struts-5aa96292/) - feel free to contact me!
