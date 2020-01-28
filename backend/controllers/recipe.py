from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.recipeModel import validate_recipe
from bson import json_util, ObjectId
import controllers.errors
import datetime

# Make timestamp, get user, save new prediction
def createRecipe():
  data = validate_longrunningtask(request.get_json())
  if data['ok']:
    data = data['data']
    user = mongo.db.users.find_one({'email': data['submittedBy']})
    data['submittedBy'] = user['_id']
    data['timeStarted'] = datetime.datetime.utcnow()
    newPrediction = mongo.db.longrunningtasks.insert_one(data).inserted_id
    return jsonify({'ok': True, 'data': newLongRunningTask }), 200
  else:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

def getRecipe():
  return

def updateRecipe():
  return

# Get long running task, get link to associated file, remove long running task, return link to file
def deleteRecipe():
  try:
    data = request.get_json()
    longrunningtaskID = data['predictionID']
    longrunningtask = mongo.db.longrunningtasks.find_one({'_id': ObjectId(longrunningtaskID)})
    fileToRemove = {}
    fileToRemove['filename'] = str(longrunningtask.get('storedAt'))
    mongo.db.longrunningtasks.remove(longrunningtask)
    return jsonify({'ok': True, 'data': fileToRemove }), 200
  except:
    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400