from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError
from bson import ObjectId

# A recipe contains a title,
# The id of the creator,
# Image paths, serving sizes, tags, country of origin, type of dish, tags, all steps and an array of ingredient IDs

recipe_schema = {
    "type": "object",
    "properties": {
        "recipeTitle": {
            "type": "string"
        },
        "submittedBy": {
            "type": "string",
            "format": "email"
        },
        "image": {
            "type": "string",
        },
        "servings": {
          "type": "string"
        },
        "origin": {
          "type": "string" 
        },
        "formType": { 
          "type": "string" 
        },
        "tags": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "tagID": {
                        "type": "string"
                    }
                }
            }
        },
        "ingredients": {
            "type": "object",
            "properties": {
                "amount": {
                    "type": "string",
                },
                "unit": {
                    "type": "object",
                    "properties": {
                        "unitID": {
                            "type": "string"
                        }
                    }
                },
                "item": {
                    "type": "object",
                    "properties": {
                        "ingredientID": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "steps": {
            "type": "string"
        }
    },
    "required": ["recipeTitle", "submittedBy", "storedAt", "servings", "formType", "tags", "ingredients", "steps"],
    "additionalProperties": False
}

# When data is going to be stored, try the data against the model to make sure it has the right format of required items
def validate_recipe(data):
    try:
        validate(data, recipe_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}