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
		status = requests.post()