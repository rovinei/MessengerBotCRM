from django.conf.urls import url, include
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
)

from rest_framework.urlpatterns import format_suffix_patterns
from . import views

app_name = "api"

urlpatterns = [
	url(r'^$', get_schema_view()),
	url(r'^auth/token/obtain/$', TokenObtainPairView.as_view()),
	url(r'^auth/token/refresh/$', TokenRefreshView.as_view()),
	url(r'^bot/$', views.FacebookPageBotView.as_view()),
	url(r'^bot/(?P<pk>[0-9]+)/$', views.FacebookPageBotGenericAPIView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
