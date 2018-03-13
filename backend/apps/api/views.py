from rest_framework.response import Response
from rest_framework import views, status, generics
from . import serializers
from backend.apps.messengerbot.models import MessengerBotProfile


class FacebookPageBotView(views.APIView):
	"""
	Generic API view for facebook page messenger bot profile
	"""
	def post(self, request, *args, **kwargs):
		serializer = serializers.FacebookPageBotSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	

class FacebookPageBotGenericAPIView(generics.RetrieveUpdateDestroyAPIView):
	queryset = MessengerBotProfile.objects.all()
	serializer_class = serializers.FacebookPageBotSerializer

