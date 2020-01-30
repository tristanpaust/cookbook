from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.unitModel import validate_unit
from bson import json_util, ObjectId
from flask_jwt_extended import (get_jwt_identity)

import controllers.errors
import re

# Check data submitted, save in database or error
def createUnit():
    data = validate_unit(request.get_json())
    if data['ok']:
      data = data['data']
      unitExists = mongo.db.units.find_one({'title': data})
      if not unitExists:
        unit = mongo.db.units.insert_one(data)
        newUnit = {}
        newUnit['_id'] = unit.inserted_id 
        newUnit['title'] = data

        return jsonify({'ok': True, 'data': data }), 200
      print(unitExists)
    else:
      print(data)
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

# Find all units that contain the letters the user searched for
def searchUnit():
  unit = request.args['q']

  data =  mongo.db.units.aggregate(
    [
      {"$match": {"title": re.compile(".*" + unit + ".*")}},
    ]
  )

  data = list(data)
  print(data)
  return jsonify({'ok': True, 'data': data }), 200

