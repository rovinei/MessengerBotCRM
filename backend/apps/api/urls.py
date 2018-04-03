from django.conf.urls import url
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
)

from rest_framework.urlpatterns import format_suffix_patterns
from backend.apps.messengerbot import views as bot_view
from backend.apps.users import views as user_view

app_name = "api"

urlpatterns = [
	url(r'^$', get_schema_view()),
	url(r'^auth/token/obtain/$', TokenObtainPairView.as_view()),
	url(r'^auth/token/refresh/$', TokenRefreshView.as_view()),
	url(r'^bot/$', bot_view.FacebookPageBotAPIView.as_view(), name='bot-list'),
	url(r'^bot/(?P<pk>[0-9]+)/$', bot_view.FacebookPageBotGenericAPIView.as_view(), name='bot-detail'),
	url(r'^users/$', user_view.UserListAPI.as_view(), name='user-list'),
	url(r'^users/(?P<pk>[0-9]+)/$', user_view.UserDetailAPI.as_view(), name='user-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
