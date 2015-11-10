import requests
import datetime
from datetime import timedelta
import lxml.html
import html.parser
import re
from pymongo import MongoClient

def auto_capitalize_artist(artist):
	artist=artist.lower()
	artistWords = artist.split()
	artist=''
	for word in artistWords:
		word=word[0].upper() + word[1:]
		artist += word
		artist += ' '
	artist=artist.rstrip()
	return artist

def parse_featured_artists(original_artist):
	featuring_words=[' Featuring ',' With ',' Feat. ', ' Feat ']
	for word in featuring_words:
		if word in original_artist:
			primary_artist = original_artist.split(word,1)[0]
			featured_artists = original_artist.split(word,1)[1].split(',')
			if len(featured_artists) > 0:
				last_artist=featured_artists.pop()
				if ' And ' in last_artist:
					for artist in last_artist.split(' And '):
						featured_artists.append(artist)
				elif ' & ' in last_artist:
					for artist in last_artist.split(' & '):
						featured_artists.append(artist)
				else:
					featured_artists.append(last_artist)

			for i in range(0,len(featured_artists)):
				featured_artists[i]=featured_artists[i].strip()

			return [primary_artist] + featured_artists
	return [original_artist]	

def add_to_reverse_lookup_table(chart_type,date,position,artist,item):

	collection=mongo_database['reverse_lookup']

	date_str=str(date)
	new_entry={'date':date_str,'position':position}

	update_result=collection.update_one(
		{
			'artist':{'$regex':'^'+re.escape(artist)+'$','$options':'i'},
			'charted_items':{
				'$elemMatch':{
					'item_name':{'$regex':'^'+re.escape(item)+'$','$options':'i'},
					'chart_type':chart_type
				}
			}
		},
		{
			'$set':{'charted_items.$.dropoff_position':position},
			'$min':{'charted_items.$.peak_position':position},
			'$push':{'charted_items.$.entries':new_entry}
		},
		upsert=False
	)

	if update_result.modified_count <= 0:
		
		new_charted_item={
			'item_name':item,
			'chart_type':chart_type,
			'peak_position':position,
			'entry_position':position,
			'dropoff_position':position,
			'entries':[
				{
					'date':date_str,
					'position':position
				}
			]			
		}

		collection.update_one(
			{'artist':{'$regex':'^'+re.escape(artist)+'$','$options':'i'}},
			{
				'$push':{'charted_items':new_charted_item},
				'$setOnInsert':{'artist':artist}
			},
			upsert=True
		)

def add_to_chart(chart_type,date,position,artist,item):
	collection=mongo_database[chart_type]
	date_str=str(date)
	entry={'position':position,'artist':artist,'item':item}
	collection.update_one({'_id':date_str},{'$push':{'entries':entry}},upsert=True)

def save_entry(chart_type,date,position,artist,item):
	add_to_chart(chart_type,date,position,artist,item)
	try:
		featured_artists=parse_featured_artists(artist)
		for featured_artist in featured_artists:
			add_to_reverse_lookup_table(chart_type,date,position,featured_artist,item)
	except Exception as e:
		print(e)
		add_to_reverse_lookup_table(chart_type,date,position,artist,item)

def process_chart_for_date(chart_type,date):

	#Get strings from each component of the date
	day=str(date.day)
	month=str(date.month)
	year=str(date.year)
	
	print(str(date) + ' ' + chart_type)
	
	#Add a leading 0 if necessary
	if (date.month < 10):
		month = '0' + month        
	if (date.day < 10):
		day = '0' + day
	
	#Perform request to UMD and use XPath to parse the HTML into an array of chart rows
	if (chart_type is 'billboard_singles'):
		umd_url='http://www.umdmusic.com/default.asp?Lang=English&Chart=D&ChDay=%s&ChMonth=%s&ChYear=%s&ChBand=&ChSong=' % (day, month, year)
	elif (chart_type is 'billboard_albums'):
		umd_url='http://www.umdmusic.com/default.asp?Lang=English&Chart=E&ChDay=%s&ChMonth=%s&ChYear=%s&ChBand=&ChSong=' % (day, month, year)

	r=requests.get(umd_url)

	tree=lxml.html.fromstring(r.text)
	rows=tree.xpath('/html/body/table[2]/tr[2]/td[2]/table[4]/tr')

	#First two rows are just column labels, so remove them
	rows.pop(0)
	rows.pop(0)

	for row in rows:
		#Get a list of the table cells in the row
		cells=list(row)

		#The first cell is the chart position, then remove extra spaces
		position=int(cells[0].text.strip())

		#The fifth cell contains the artist and item name (song/album). The artist/item are individual HTML elements, so we can easily make them a list
		artist_and_item=list(cells[4])

		if len(artist_and_item) >= 2:

			#The first item in the list is the name of the song/album, then remove extra spaces
			item=html_parser.unescape(artist_and_item[0].text.strip())

			#The second is the artist - since the <br> tag is unmatched, we have to do a workaround instead of using .text
			artist=html_parser.unescape(lxml.html.tostring(artist_and_item[1]).decode('utf-8')).replace('<br>','').strip()

			#Artist comes in in all caps, do some logic to capitalize the first letter of each word and leave the rest lowercase
			artist=auto_capitalize_artist(artist)

			#print('#%s: %s - %s' % (position, artist, item))	
			save_entry(chart_type,date,position,artist,item)

		else:
			artist_and_item=lxml.html.tostring(cells[4]).decode('utf-8').split('<br>')
			
			artist=artist_and_item[1]
			item=artist_and_item[0]

			artist=artist[0:artist.find('</b>')].strip()
			artist=auto_capitalize_artist(artist)

			item=item.split('<b>')[1].strip()

			#print('#%s: %s - %s' % (position, artist, item))	
			save_entry(chart_type,date,position,artist,item)

def get_next_saturday(date):
	saturday = 6
	while date.isoweekday() is not saturday:
		date=date+datetime.timedelta(days=1)
	return date


def main():

	global html_parser
	html_parser = html.parser.HTMLParser()

	#Initialize Mongo connection

	mongo_host='localhost'
	mongo_port=27017
	mongo_username=''
	mongo_password=''
	mongo_dbname='billboard'
	#uri='mongodb://%s:%s@%s' % (mongo_username, mongo_password, mongo_host)
	uri='mongodb://%s' % (mongo_host)
	mongo_client=MongoClient(uri)

	global mongo_database
	mongo_database=mongo_client[mongo_dbname]

	date=datetime.date(year=2015,month=11,day=7)	
	date=get_next_saturday(date)	

	current_date=datetime.date.today()

	while (date < current_date):
		process_chart_for_date('billboard_singles',date)
		date=date+datetime.timedelta(days=7)


if __name__ == '__main__':
	main()