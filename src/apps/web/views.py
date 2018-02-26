from django.shortcuts import render


def home_page(request):
    context = dict()
    context.update({
        'meta': {
            'page_title': 'Messenger Bot for CRM | Welcome'
        }
    })
    return render(request=request, template_name='web/home.html', context=context)


def privacy_page(request):
    context = dict()
    context.update({
        'meta': {
            'page_title': 'Messenger Bot for CRM | Privacy and policy'
        }
    })
    return render(request=request, template_name='web/privacy.html', context=context)


def tos_page(request):
    context = dict()
    context.update({
        'meta': {
            'page_title': 'Messenger Bot for CRM | Term of service'
        }
    })
    return render(request=request, template_name='web/tos.html', context=context)


