from flask import request, jsonify
from application import mongo
from application import flask_bcrypt
from models.ingredientModel import validate_ingredient
from bson import json_util, ObjectId
from flask_jwt_extended import (get_jwt_identity)

import controllers.errors
import re

# Check data submitted, save in database or error
def createIngredient():
    data = validate_ingredient(request.get_json())
    if data['ok']:
      data = data['data']
      ingredientExists = mongo.db.ingredients.find_one({'title': data})
      if not ingredientExists:
        ingredient = mongo.db.ingredients.insert_one(data)
        newIngredient = {}
        newIngredient['_id'] = ingredient.inserted_id 
        newIngredient['title'] = data

        return jsonify({'ok': True, 'data': data }), 200
      print(ingredientExists)
    else:
      print(data)
      return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

# Find all ingredients that contain the letters the user searched for
def searchIngredient():
  ingredient = request.args['q']

  data =  mongo.db.ingredients.aggregate(
    [
      {"$match": {"title": re.compile(".*" + ingredient + ".*")}},
    ]
  )

  data = list(data)
  return jsonify({'ok': True, 'data': data }), 200