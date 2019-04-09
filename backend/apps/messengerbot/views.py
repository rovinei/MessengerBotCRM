from django.shortcuts import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.response import Response
from rest_framework import views, status, generics
from backend.apps.users.models import User

from backend.apps.messengerbot.models import MessengerBotProfile
from backend.apps.messengerbot.facebook_api import (
	do_messenger_profile,
	do_webhook_subscription,
	get_page_detail,
	exchange_long_lived_token,
	is_valid_token
)
from . import facebook_api
from . import serializers
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
		logging.debug("Facebook messenger page hook")
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
					print("STACK MESSAGE: ", stack_message)
					print('message' in stack_message)
					if 'message' in stack_message:
						print("SEND USER A MESSAGE")
						graph_api_url = settings.FACEBOOK_GRAPH_API_ENDPOINT + settings.FACEBOOK_APP_VERSION + '/me/messages'
						message_event = "page_messaging"
						message_text = str(stack_message['message']['text']).lower()
						message_words = (re.sub('\s+', ' ', message_text).strip()).split()
						logging.debug(message_words)
						messengerBot = MessengerBotProfile.objects.get(page_uuid = from_page_uuid)
						response_message = dict()
						params = dict()
						headers = dict()
						params.update({
							"access_token": messengerBot.long_lived_access_token
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
							response_status = response_status.json()
							logging.debug("MESSAGE SEND STATUS", response_status)

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
		logging.debug("Facebook messenger user hook")
		logging.debug(incoming_message)
		return HttpResponse(status=200)


class FacebookPageBotAPIView(views.APIView):
	"""
	Generic API view for facebook page messenger bot profile
	"""
	
	def post(self, *args, **kwargs):
		context = dict()
		messenger_data = self.request.data['messenger']
		server_data = self.request.data['server']
		fb_user = self.request.data['user']
		print(server_data['page_uuid'])
		print(fb_user['access_token'])
		print(messenger_data)
		
		# is_valid = is_valid_token(fb_user['access_token'])
		# if not is_valid:
		# 	print('TOKEN INVALID')
		# 	context.update({
		# 		'error': {
		# 			'code': 417,
		# 			'message': 'Facebook token has expired, please login to facebook or re-authenticate with our facebook app again.'
		# 		}
		# 	})
		# 	response = Response(context, status=status.HTTP_417_EXPECTATION_FAILED)
		# 	return response
		# print('TOKEN VALID')
		long_lived_token = exchange_long_lived_token(fb_user['access_token'])
		if not long_lived_token:
			print('FAILED OBTAIN LONG LIVED TOKEN')
			context.update({
				'error': {
					'code': 417,
					'message': 'Cannot obtain access token from facebook, please try again.'
				}
			})
			response = Response(context, status=status.HTTP_417_EXPECTATION_FAILED)
			return response
		print('OBTAINED LONG LIVED TOKEN')
		page_detail = get_page_detail(access_token=long_lived_token, page_id=server_data['page_uuid'],
		                              fields='access_token')
		if not page_detail or 'error' in page_detail:
			print('FAILED GET PAGE DETAIL')
			context.update({
				'error': {
					'code': (lambda: page_detail['error']['code'], '307')[page_detail == False],
					'message':
						(lambda: page_detail['error']['message'], 'Failed to obtain page access token from facebook')[
							page_detail == False]
				}
			})
			response = Response(context, status=status.HTTP_417_EXPECTATION_FAILED)
			return response
		page_token = page_detail['access_token']
		print('GET PAGE DETAIL TOKEN', page_token)
		msg_profile_response = do_messenger_profile(access_token=page_token, action='SET', data=messenger_data)
		print("MSG PROFILE", msg_profile_response)
		if 'error' in msg_profile_response:
			print('FAILED MESSENGER PROFILE')
			context.update({
				'error': {
					'code': msg_profile_response['error']['code'],
					'message': msg_profile_response['error']['message']
				}
			})
			response = Response(context, status=status.HTTP_417_EXPECTATION_FAILED)
			return response
		print('DONE MESSENGER PROFILE')
		webhook_response = do_webhook_subscription(access_token=page_token, page_id=server_data.get('page_uuid'),
		                                           action='POST')
		print("DO WEEBHOOK", webhook_response)
		if 'error' in webhook_response:
			print('FAILED WEBHOOK SUBSCRIPTION')
			context.update({
				'error': {
					'code': webhook_response['error']['code'],
					'message': webhook_response['error']['message']
				}
			})
			response = Response(context, status=status.HTTP_417_EXPECTATION_FAILED)
			return response
		print('DONE WEBHOOK SUBSCRIPTION')
		server_data['long_lived_access_token'] = page_token
		server_data['access_token'] = page_token
		print('NEW SERVER DATA', server_data)
		serializer = serializers.FacebookPageBotSerializer(data=server_data, context={'request': self.request})
		if serializer.is_valid():
			serializer.save()
			print('SAVED BOT PROFILE')
			response = Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			print('INVALID BOT PROFILE DATA')
			context.update({
				'error_fields': serializer.errors
			})
			response = Response(context, status=status.HTTP_417_EXPECTATION_FAILED)
		return response
	
	def get(self, *args, **kwargs):
		user = User.objects.get(pk=self.request.user.pk)
		bots = user.bots.all()
		serializer = serializers.FacebookPageBotSerializer(bots, many=True, context={'request': self.request})
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response


class FacebookPageBotGenericAPIView(generics.GenericAPIView):
	serializer_class = serializers.FacebookPageBotSerializer
	
	def get_queryset(self):
		return MessengerBotProfile.objects.all().filter(owner=self.request.user)
	
	def get_object(self):
		queryset = self.get_queryset()
		filter_attr = {}
		for field in self.multiple_lookup_fields:
			filter_attr[field] = self.kwargs[field]
		
		bot = get_object_or_404(queryset, **filter_attr)
		return bot




