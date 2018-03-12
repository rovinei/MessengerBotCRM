from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from . import facebook_api
import logging
import logging.config
import sys
import json
import re

LOGGING = {
	'version': 1,
	'handlers': {
		'console': {
			'class': 'logging.StreamHandler',
			'stream': sys.stdout,
		}
	},
	'root': {
		'handlers': ['console'],
		'level': 'DEBUG'
	}
}

logging.config.dictConfig(LOGGING)


@csrf_exempt
def facebook_page_webhook(request):
	if request.method == 'GET':
		mode = request.GET['hub.mode']
		token = request.GET['hub.verify_token']
		challenge = request.GET['hub.challenge']
		if mode and token:
			if mode == 'subscribe' and token == settings.MESSENGER_BOT_HUB_TOKEN:
				return HttpResponse(status=200, content=challenge)
		else:
			return HttpResponse(status=403)
	elif request.method == 'POST':
		incoming_message = json.loads(request.body.decode('utf-8'))
		entries_message = incoming_message['entry']
		logging.debug("Facebook messenger hook")
		logging.debug(incoming_message)
		
		if incoming_message['object'] == 'page':
			for entry in entries_message:
				from_page_uuid = entry['id']
				webhook_sent_time = entry['time']
				messaging = entry['messaging']
				for stack_message in messaging:
					user_page_id = stack_message['sender']['id']
					recipient_page_uuid = stack_message['recipient']['id']
					message_sent_time = stack_message['timestamp']
					
					if 'message' in stack_message:
						graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/me/messages'
						message_event = "page_messaging"
						message_text = str(stack_message['message']['text']).lower()
						message_words = (re.sub('\s+', ' ', message_text).strip()).split()
						logging.debug(message_words)
						
						response_message = dict()
						params = dict()
						headers = dict()
						params.update({
							"access_token": settings.PAGE_ACCESS_TOKEN
						})
						headers.update({
							"Content-Type": "application/json"
						})
						if 'bunny' in message_words:
							
							response_message.update({
								"recipient": {
									"id": user_page_id
								},
								"message": {
									"text": "Who the hell is that guy?"
								},
								"messaging_type": "RESPONSE"
							})
							
						else:
							response_message.update({
								"recipient": {
									"id": user_page_id
								},
								"message": {
									"text": """
											Sorry, but I don't really much understand about your message,
											because I'm just a bot, but don't worry we will response to you soon
											"""
								},
								"messaging_type": "RESPONSE"
							})
						
						response_status = facebook_api.send_message(url=graph_api_url, data=response_message, params=params, headers=headers)
						try:
							logging.debug("MESSAGE SEND STATUS")
							logging.debug(response_status.json())
						except ValueError as exc1:
							logging.debug("MESSAGE SEND STATUS ERROR")
							if isinstance(exc1, dict):
								logging.error(json.dumps(exc1))
							else:
								logging.error(exc1)
						finally:
							messenger_customer = facebook_api.get_user_info(user_id=user_page_id, access_token=settings.PAGE_ACCESS_TOKEN)
							try:
								logging.debug("GET USER INFO STATUS")
								logging.debug(messenger_customer.json())
							except ValueError as exc2:
								logging.debug("GET USER INFO STATUS ERROR")
								if isinstance(exc2, dict):
									logging.error(json.dumps(exc2))
								else:
									logging.error(exc2)
								
			return HttpResponse(status=200)
		else:
			return HttpResponse(status=403)
	

@csrf_exempt
def facebook_user_webhook(request):
	if request.method == 'GET':
		mode = request.GET['hub.mode']
		token = request.GET['hub.verify_token']
		challenge = request.GET['hub.challenge']
		if mode and token:
			if mode == 'subscribe' and token == settings.MESSENGER_BOT_HUB_TOKEN:
				return HttpResponse(status=200, content=challenge)
		else:
			return HttpResponse(status=403)
	elif request.method == 'POST':
		incoming_message = json.loads(request.body.decode('utf-8'))
		logging.debug("Facebook messenger hook")
		logging.debug(incoming_message)
		return HttpResponse(status=200)
