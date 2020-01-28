from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.tagModel import validate_tag
from bson import json_util, ObjectId
from flask_jwt_extended import (get_jwt_identity)

import controllers.errors
import datetime

# Check data submitted, save in database or error
def createTag():
    data = validate_queue(request.get_json())
    if data['ok']:
      data = data['data']
      mongo.db.tags.insert_one(data)
      return jsonify({'ok': True, 'message': 'New tag created successfully!'}), 200
    else:
      print(data)
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

# Find tags that contain the letters the user searched for
def searchTag():
  try:
    queue = mongo.db.queue.aggregate(
      [
        {"$lookup": {"from": "users", "foreignField": "_id", "localField": "userID", "as": "user"}},
        {"$lookup": {"from": "longrunningtasks", "foreignField": "_id", "localField": "longrunningtaskID", "as": "longrunningtask"}},
        {"$unwind": "$user"},
        {"$unwind": "$longrunningtask"},
        {"$project": {"user.name": 1, "user.email": 1, "longrunningtask.longrunningtaskTitle": 1, "longrunningtask.timeStarted": 1}},
      ]
    )
    queue = json_util.dumps(queue)
    return queue, 200
  except:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'}), 400