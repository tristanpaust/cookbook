import pymongo
client = pymongo.MongoClient()
client.admin.command('ismaster')