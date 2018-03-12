from django.db import models
from django.contrib.auth.models import User
import json


FLOW_CONVERSATION_TYPE = (
	('action', 'Action'),
	('trigger', 'Trigger'),
)

FLOW_INTERACTION_TYPE = (
	(1, 'Simple Question'),
	(2, 'Simple Message'),
	(3, 'Send a Message'),
	(4, 'Send a Card'),
	(5, 'Send Multiple Cards'),
	(6, 'Send Attachment'),
	(7, 'Webhook & HTTP Request'),
	(8, 'Scheduler'),
	(9, 'Send Promotional'),
)

FIELD_TYPE = (
        ('textarea', 'Textarea'),
        ('text', 'Text'),
        ('email', 'Email'),
        ('password', 'Password'),
        ('richtext', 'Richtext Box'),
        ('radio', 'Radio'),
        ('checkbox', 'Checkbox'),
        ('select', 'Dropdown select')
    )


class MessengerBotProfile(models.Model):
	"""
	Facebook page bot define by user which connected to Messenger, Slack, Line, Telegram, Web , etc.
	"""
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	title = models.CharField(max_length=250, blank=False, null=False)
	page_uuid = models.CharField(max_length=255, blank=False, null=False, unique=True, db_index=True, primary_key=True)
	access_token = models.CharField(max_length=500, blank=True, null=True, default='')
	long_lived_access_token = models.CharField(max_length=500, blank=True, null=True, default='')
	is_switched_on = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
	
	def __str__(self):
		return self.title
	
	def toggleActivationBot(self):
		if self.is_switched_on:
		
							
	
class Flow(models.Model):
	"""
	Conversation flows between bot and user
	"""
	name = models.CharField(max_length=255, blank=False, null=False)
	bot = models.ManyToManyField(MessengerBotProfile, related_name='bot')
	is_enabled = models.BooleanField(default=True)
	is_private = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
	

class FlowConversation(models.Model):
	"""
	Action which is belong to flow, action are something like question, answer, direct message, http request,
	scheduler, (set, get, update) attributes.
	Every flow must have trigger action
	"""
	type = models.CharField(max_length=255, blank=False, null=False, choices=FLOW_CONVERSATION_TYPE)
	interaction_type = models.SmallIntegerField(blank=False, null=False, choices=FLOW_INTERACTION_TYPE)
	flow = models.ForeignKey(Flow, related_name='flow', on_delete=models.CASCADE)
	data = models.TextField(default='{}')


class Promotion(models.Model):
    """
    promotions data which business owner create for marketing promotional.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500, blank=False, null=False)
    display_name = models.CharField(max_length=500, blank=False, null=False)
    is_enabled = models.BooleanField(default=True)
    is_valid = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)



