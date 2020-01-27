from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError
from bson import ObjectId

# A longrunningtask contains a title,
# The mail address of the creator,
# The path to where it is stored in ODIN,
# It could (potentially) store the resulting vector after Salmon processing (although that could also be a link to ODIN),
# After running it trough the model it has a result,
# Time started and time ended for displaying purposes
longrunningtask_schema = {
    "type": "object",
    "properties": {
        "longrunningtaskTitle": {
            "type": "string"
        },
        "submittedBy": {
            "type": "string",
            "format": "email"
        },
        "storedAt": {
            "type": "string",
        },
        "result": {
          "type": "string"
        },
        "timeStarted": {
          "type": "string" 
        },
        "timeEnded": { 
          "type": "string" 
        }
    },
    "required": ["longrunningtaskTitle", "submittedBy", "storedAt"],
    "additionalProperties": False
}

# When data is going to be stored, try the data against the model to make sure it has the right format of required items
def validate_longrunningtask(data):
    try:
        validate(data, longrunningtask_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}