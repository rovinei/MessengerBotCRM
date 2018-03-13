from django.contrib import admin
from .models import MessengerBotProfile


class MessengerBotAdmin(admin.ModelAdmin):
	list_display = ('pk', 'owner', '__str__', 'page_uuid', 'is_switched_on')
	

admin.site.register(MessengerBotProfile, MessengerBotAdmin)
