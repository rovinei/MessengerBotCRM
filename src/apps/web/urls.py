from django.urls import path
from . import views

app_name = "web"

urlpatterns = [
    path('privacy/', views.privacy_page, name='privacy_page'),
    path('term-of-service/', views.tos_page, name='tos_page'),
]
