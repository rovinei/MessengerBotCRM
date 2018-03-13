from rest_framework import serializers
from backend.apps.messengerbot.models import MessengerBotProfile


class FacebookPageBotSerializer(serializers.ModelSerializer):
	"""
	Serializer for facebook page messenger bot (Messenger Profile)
	"""
	class Meta:
		model = MessengerBotProfile
		fields = "__all__"
