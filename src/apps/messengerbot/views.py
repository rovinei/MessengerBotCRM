from django.shortcuts import render, HttpResponse
from django.conf import settings


def messenger_webhook(request):
    if request.method == 'GET':
        mode = request.GET['hub.mode']
        token = request.GET['hub.verify_token']
        challenge = request.GET['hub.challenge']
        if mode and token:
            if mode == 'subscribe' and token == settings.MESSENGER_BOT_HUB_TOKEN:
                return HttpResponse(status=200, content=challenge)
            else:
                return HttpResponse(status=403)
