from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError
from bson import ObjectId

# A unit has an ID and a title which is required
unit_schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string"        
        }
    },
    "required": ["title"],
    "additionalProperties": False
}

# When data is going to be stored, try the data against the model to make sure it has the right format of required items
def validate_queue(data):
    try:
        validate(data, queue_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}