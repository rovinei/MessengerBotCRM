from django.conf import settings
import requests
import json


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
	if action == 'GET':
		params.update({
			'fields': 'account_linking_url,persistent_menu,get_started,greeting\,whitelisted_domains,\
						payment_settings,target_audience,home_url'
		})
		response = requests.get(graph_api_url, params=params, headers=headers)

	elif action == 'SET' or action == 'UPDATE':
		if data is None:
			raise ValueError("Set messenger profile property must be include property in request.")
		response = requests.post(graph_api_url, data=json.dumps(data), params=params, headers=headers)

	elif action == 'DELETE':
		if data is None:
			raise ValueError("Deleting messenger profile property must be include property in request.")
		response = requests.delete(graph_api_url, params=params, data=json.dumps(data), headers=headers)

	return response


def do_webhook_subscription(access_token=None, page_id=None, action=None):
	if access_token is None or page_id is None or action is None:
		raise ValueError("Argument error, page access_token, action and page_id must be present.")
	params = dict()
	header = dict()
	params.update({
		'access_token': access_token
	})
	header.update({
		'Content-Type': 'application/json'
	})
	graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/{page_id}/subscribed_apps'\
	.format(page_id=page_id)

	if action == 'GET':
		response = requests.get(graph_api_url, params=params, header=header)
	elif action == 'POST':
		response = requests.post(graph_api_url, params=params, header=header)
	elif action == 'DELETE':
		response = requests.delete(graph_api_url, params=params, header=header)

	return response
