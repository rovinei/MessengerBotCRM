from django.db import models
from src.apps.account.models import User


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

class FacebookPageBot(models.Model):
	"""
	Facebook page bot define by user which connected to Messenger, Slack, Line, Telegram, Web , etc.
	"""
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	name = models.CharField(max_length=250, blank=False, null=False)
	page_uuid = models.CharField(max_length=255, blank=False, null=False, unique=True, db_index=True, primary_key=True)
	access_token = models.CharField(max_length=500, blank=True, null=True, default='')
	long_lived_access_token = models.CharField(max_length=500, blank=True, null=True, default='')
	welcome_text = models.CharField(max_length=500, blank=True, null=True, default='')
	greeting_text = models.CharField(max_length=500, blank=True, null=True, default='')
	locale = models.CharField(max_length=50, blank=True, null=True, default='en_US')
	persistent_menu = models.TextField(default='{}')
	is_enabled_menu = models.BooleanField(default=False)
	is_disabled_text = models.BooleanField(default=False)
	is_lived = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
	
	
class Flow(models.Model):
	"""
	Conversation flows between bot and user
	"""
	name = models.CharField(max_length=255, blank=False, null=False)
	bot = models.ManyToManyField(FacebookPageBot, related_name='bot')
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
	flow = models.ForeignKey(Flow, related_name='flow')
	data = models.TextField(default='{}')


