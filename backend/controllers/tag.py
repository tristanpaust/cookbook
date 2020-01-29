from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.tagModel import validate_tag
from bson import json_util, ObjectId
from flask_jwt_extended import (get_jwt_identity)

import controllers.errors
import re

# Check data submitted, save in database or error
def createTag():
    data = validate_tag(request.get_json())
    if data['ok']:
      data = data['data']
      tagExists = mongo.db.tags.find_one({'title': data})
      if not tagExists:
        tag = mongo.db.tags.insert_one(data)
        newTag = {}
        newTag['_id'] = tag.inserted_id 
        newTag['title'] = data

        return jsonify({'ok': True, 'data': data }), 200
      print(tagExists)
    else:
      print(data)
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

# Find all tags that contain the letters the user searched for
def searchTag():
  tag = request.args['q']

  data =  mongo.db.tags.aggregate(
    [
      {"$match": {"title": re.compile(".*" + tag + ".*")}},
    ]
  )

  data = list(data)
  
  return jsonify({'ok': True, 'data': data }), 200

