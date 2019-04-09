from django.conf import settings
import requests
import json
import urllib


def send_message(url, data=None, params=None, headers=None):
	if data is None:
		data = dict()
	if params is None:
		params = dict()
	if headers is None:
		headers = dict()
		headers.update({
			"Content-Type": "application/json"
		})
		
	status = requests.post(url, data=json.dumps(data), params=params, headers=headers)
	return status


def get_user_info(user_id=None, params=None, headers=None, access_token=None):
	if not user_id or not access_token:
		raise ValueError("user id and access token must provides.")
	
	if params is None:
		params = dict()
		params.update({
			"fields": "id,first_name,last_name,profile_pic,gender"
		})
		
	if headers is None:
		headers = dict()
		headers.update({
			"Content-Type": "application/json"
		})
		
	params.update({
		"access_token": access_token
	})
	graph_api_ur = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/{user_id}'.format(user_id=user_id)
	status = requests.get(graph_api_ur, params=params, headers=headers)
	return status


def toggleActivationBot(access_token, is_on):
	if is_on:
		pass


def do_messenger_profile(access_token=None, action=None, data=None):
	if access_token is None or action is None:
		raise ValueError("Missing arguments error, access_token and action must be present.")
	graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/me/messenger_profile'
	params = dict()
	headers = dict()
	params.update({
		'access_token': access_token
	})
	headers.update({
		'Content-Type': 'application/json'
	})
	print('DOING MESSENGER PROFILE')
	if action == 'GET':
		params.update({
			'fields': 'account_linking_url,persistent_menu,get_started,greeting\,whitelisted_domains,\
						payment_settings,target_audience,home_url'
		})
		response = requests.get(graph_api_url, params=params, headers=headers)

	elif action == 'SET' or action == 'UPDATE':
		if data is None:
			raise ValueError("Set messenger profile property must be include property in request.")
		print("DUMP DATA", json.dumps(data))
		response = requests.post(graph_api_url, data=json.dumps(data), params=params, headers=headers)

	elif action == 'DELETE':
		if data is None:
			raise ValueError("Deleting messenger profile property must be include property in request.")
		response = requests.delete(graph_api_url, params=params, data=json.dumps(data), headers=headers)
	
	response = response.json()
	return response


def do_webhook_subscription(access_token=None, page_id=None, action=None):
	if access_token is None or page_id is None or action is None:
		raise ValueError("Argument error, page access_token, action and page_id must be present.")
	params = dict()
	headers = dict()
	params.update({
		'access_token': access_token,
		'subscribed_fields': 'messages,members',
	})
	headers.update({
		'Content-Type': 'application/json'
	})
	print('DOING WEBHOOK SUBSCRIPTION')
	graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/{page_id}/subscribed_apps'\
	.format(page_id=page_id)

	if action == 'GET':
		response = requests.get(graph_api_url, params=params, headers=headers)
	elif action == 'POST':
		response = requests.post(graph_api_url, params=params, headers=headers)
	elif action == 'DELETE':
		response = requests.delete(graph_api_url, params=params, headers=headers)
	response = response.json()
	return response


def exchange_long_lived_token(access_token=None):
	if access_token is None:
		raise ValueError("Argument error, access_token  must present.")
	params = dict()
	headers = dict()
	params.update({
		'fb_exchange_token': access_token,
		'client_secret': settings.FACEBOOK_APP_SECRET,
		'client_id': settings.FACEBOOK_APP_ID,
		'grant_type': 'fb_exchange_token'
	})
	headers.update({
		'Content-Type': 'application/json'
	})
	print('EXCHANGING TOKEN')
	graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/oauth/access_token'
	response = requests.get(graph_api_url, params=params, headers=headers)
	response = response.json()
	print("LONG LIVED TOKEN: ", response)
	if 'access_token' in response:
		long_lived_token = response.get('access_token')
	else:
		long_lived_token = False
	
	print("LONG_LIVED_TOKEN", long_lived_token)
	return long_lived_token
	
def get_page_detail(access_token=None, page_id=None, fields=None):
	if access_token is None or page_id is None:
		raise ValueError("Argument error, access_token and page_id must be present.")
	params = dict()
	headers = dict()
	params.update({
		'access_token': access_token
	})
	if fields is not None and isinstance(fields, str):
		params.update({
			'fields': fields
		})
	headers.update({
		'Content-Type': 'application/json'
	})
	print('GETTING PAGE DETAIL')
	graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/me/accounts'
	def get_pages(url):
		response = requests.get(url, params=params, headers=headers)
		response = response.json()
		pagination = response.get('paging')
		print("GET PAGE DETAIL: ", response)
		if 'data' in response:
			data = response.get('data')
			for page in data:
				print('PAGE', page)
				if page['id'] == page_id:
					return page
				
			if 'next' in pagination:
				return get_pages(pagination['next'])
			else:
				return False
		else:
			return response
	
	return get_pages(graph_api_url)


def debug_access_token(input_token=None):
	if input_token is None:
		raise ValueError("Argument error, input_token must be present.")
	params = dict()
	headers = dict()
	access_token = settings.FACEBOOK_APP_ID + '|' + settings.FACEBOOK_APP_SECRET
	params.update({
		'access_token': access_token,
		'input_token': input_token
	})
	headers.update({
		'Content-Type': 'application/json; charset=utf8'
	})

	print('DEBUGGING TOKEN', params)
	# graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/debug_token'
	# query = urllib.urlencode(params).replace('%7C', '|')
	# ses = requests.Session()
	# req = requests.Request(method='GET', url=graph_api_url)
	# prep = req.prepare()
	# prep.url = graph_api_url + query
	# r = ses.send(prep)

	graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/debug_token?'+params
	response = requests.get(graph_api_url, headers=headers)
	print(response.url)
	response = response.json()
	print("TOKEN DEBBUGED OBJECT", response)
	return response


def is_valid_token(input_token=None):
	response = debug_access_token(input_token)
	data = response.get('data')
	is_valid = data.get('is_valid')
	return is_valid
