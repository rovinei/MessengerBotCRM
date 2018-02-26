from django.conf.urls import url
from src.apps.account import views

app_name = 'account'

urlpatterns = [
    url(r'^register$', views.register, name='register'),
    url(r'^login$', views.login, name='login'),
    url(r'^logout$', views.logout, name='logout'),

]