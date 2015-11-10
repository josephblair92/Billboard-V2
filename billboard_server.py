from flask import Flask, request, jsonify, abort
from pymongo import MongoClient
import os
import datetime

def init_mongo():
	
	#uri='mongodb://%s:%s@%s:%s/%s' % (mongo_username, mongo_password, mongo_host, mongo_port, mongo_dbname)

	mongo_dbname='billboard'
	uri=os.environ['BILLBOARD_MONGO_URL']
	mongo_client=MongoClient(uri)

	global mongo_database
	mongo_database=mongo_client[mongo_dbname]

app=Flask(__name__)
init_mongo()

@app.route('/')
def test():
	return 'testing'

@app.route('/reverse/artist')
def reverse_lookup_artist():
	artist=request.args['artist']
	collection=mongo_database['reverse_lookup']
	data=collection.find_one({'artist':artist})
	if data is None:
		abort(404)
	data.pop('_id')
	return jsonify(data)

@app.route('/chart')
def get_chart():
	chart_type=request.args['type']
	if chart_type != 'billboard_singles' and chart_type != 'billboard_albums':
		print('error1')
		abort(400)
	try:
		date=datetime.datetime.strptime(request.args['date'], "%m%d%Y")
		date_str=datetime.datetime.strftime(date,"%Y-%m-%d")
		print(date_str)
	except Exception as e:
		print('error2')
		print(e)
		abort(400)
	collection=mongo_database[chart_type]
	print(str(date))
	chart=collection.find_one({'_id':date_str})
	if chart is not None:
		chart['date']=chart.pop('_id')
		return jsonify(chart)
	else:
		abort(400)

if __name__ == '__main__':
	app.debug=True
	app.run()
