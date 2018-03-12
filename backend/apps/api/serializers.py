from rest_framework import serializers
from backend.apps.messengerbot.models import FacebookPageBot


class FacebookPageBotSerializer(serializers.ModelSerializer):
	"""
	Serializer for facebook page messenger bot (Messenger Profile)
	"""
	class Meta:
		model = FacebookPageBot
		fields = ("__all__",)