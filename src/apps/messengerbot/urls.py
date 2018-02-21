from django.urls import path
from . import views

app_name = 'messengerbot'

urlpatterns = [
    path('', views.messenger_webhook, name='messenger_webhook'),
]
