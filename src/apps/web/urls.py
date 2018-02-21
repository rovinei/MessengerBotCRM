from django.urls import path
from . import views

app_name = "web"

urlpatterns = [
    path('/', views.home_page, name='home_page'),
    path('privacy/', views.privacy_page, name='privacy_page'),
    path('term-of-service/', views.tos_page, name='tos_page'),
]
