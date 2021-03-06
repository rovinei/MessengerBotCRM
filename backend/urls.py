"""MessengerBotCRM URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin, auth
from django.urls import path, include
from django.views.generic import TemplateView


urlpatterns = [
	path('', TemplateView.as_view(template_name="dashboard/dashboard.html")),
	path('', include('backend.apps.web.urls', namespace='web')),
	path('admins/', admin.site.urls),
	path('webhook/', include('backend.apps.messengerbot.urls', namespace='messengerbot')),
	path('api/', include('backend.apps.api.urls', namespace='api')),
	path('api/auth/', include('rest_framework.urls', namespace='rest_framework')),
]
