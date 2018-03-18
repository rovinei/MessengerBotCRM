from rest_framework.response import Response
from rest_framework import views, status, generics
from django.contrib.auth.models import User
from . import serializers
from backend.apps.messengerbot.models import MessengerBotProfile


class FacebookPageBotView(views.APIView):
	"""
	Generic API view for facebook page messenger bot profile
	"""
	def post(self, request, *args, **kwargs):
		serializer = serializers.FacebookPageBotSerializer(data=request.data)
		if serializer.is_valid(raise_exception=False):
			serializer.save()
			response = Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			response = Response({}, status=status.HTTP_417_EXPECTATION_FAILED)
		return response
	
	def get(self, request, *args, **kwargs):
		user = User.objects.get(pk=request.user.pk)
		bots = user.bots.all()
		serializer = serializers.FacebookPageBotSerializer(bots, many=True, context={'request': request})
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response
		

class FacebookPageBotGenericAPIView(generics.RetrieveUpdateDestroyAPIView):
	queryset = MessengerBotProfile.objects.all()
	serializer_class = serializers.FacebookPageBotSerializer

