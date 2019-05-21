from django.urls import path
from . import views

app_name = 'messengerbot'

urlpatterns = [
    path('', views.facebook_page_webhook, name='facebook_page_webhook'),
    path('', views.facebook_user_webhook, name='facebook_user_webhook'),
]
