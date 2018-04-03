from rest_framework import serializers
from backend.apps.messengerbot.models import MessengerBotProfile


class FacebookPageBotSerializer(serializers.ModelSerializer):
	"""
	Serializer for facebook page messenger bot (Messenger Profile)
	"""
	owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
	
	class Meta:
		model = MessengerBotProfile
		fields = ('url', 'title', 'page_uuid', 'access_token', 'long_lived_access_token', 'is_switched_on', 'owner', 'created_at', 'updated_at')
		extra_kwargs = {
			'url': {
				'view_name': 'api:bot-detail',
			}
		}
		

		