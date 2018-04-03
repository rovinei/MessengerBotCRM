from backend.apps.users.models import User
from rest_framework import generics

from .serializers import UserSerializer


class UserListAPI(generics.ListCreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer


class UserDetailAPI(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer
	
	def get_queryset(self):
		return User.objects.all().filter(username=self.request.user)