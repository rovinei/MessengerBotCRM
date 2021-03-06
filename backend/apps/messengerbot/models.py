from django.db import models
from django.conf import settings
from .facebook_api import get_page_detail, is_valid_token
import random
import string
import os


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

def upload_promotion_thumbnail(instance, filename):
	hash_filename = ''.join(random.choice(string.ascii_letters + string.digits) for x in range(48))
	origin_filename, extension = os.path.splitext(filename)
	return '{0}/{1}/{2}/{3}'.format('promotion', 'thumbnail', instance.user.pk, hash_filename.__add__(extension))


class MessengerBotProfile(models.Model):
	"""
	Facebook page bot define by user which connected to Messenger, Slack, Line, Telegram, Web , etc.
	"""
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bots')
	title = models.CharField(max_length=250, blank=False, null=False)
	page_uuid = models.CharField(max_length=255, blank=False, null=False, unique=True, db_index=True, primary_key=True)
	access_token = models.CharField(max_length=500, blank=True, null=True, default='')
	long_lived_access_token = models.CharField(max_length=500, blank=True, null=True, default='')
	is_switched_on = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
	
	def __str__(self):
		return self.title
	
	def toggle_activation_bot(self):
		self.is_switched_on = not self.is_switched_on
		
	def is_valid_access_token(self):
		is_valid = is_valid_token(self.long_lived_access_token)
		return is_valid
	
	def get_page_detail(self):
		fields = 'id,access_token,name,username,fan_count,overall_star_rating,phone'
		response = get_page_detail(self.long_lived_access_token, self.page_uuid, fields=fields)
		return response
							
	
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
	content = models.TextField(default='{}')


class Promotion(models.Model):
	"""
    promotions data which business owner create for marketing promotional.
    """
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	title = models.CharField(max_length=500, blank=False, null=False)
	display_name = models.CharField(max_length=500, blank=False, null=False)
	thumbnail = models.ImageField(upload_to=upload_promotion_thumbnail)
	heading = models.CharField(max_length=250, blank=True, null=True, default='')
	caption = models.TextField(max_length=999, default='')
	content = models.TextField(default='{}')
	is_enabled = models.BooleanField(default=True)
	is_valid = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
	updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)



