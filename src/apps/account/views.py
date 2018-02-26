from django.shortcuts import redirect, render
from django.contrib.auth import login as account_login, authenticate, logout as account_logout
from django.views.decorators.csrf import csrf_protect
from src.apps.account.forms import AuthenticationForm, RegistrationForm


clothes_type = [
    'Shirt',
    'T-Shirt',
    'Trouser',
    'Jean',
    'Shock',
    'Towel',
    'Short',
    'Jacket',
    'Blanket',
    'Skirt',
]


@csrf_protect
def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    else:
        if request.method == 'POST':
            form = AuthenticationForm(data=request.POST)
            if form.is_valid():
                user = authenticate(username=request.POST['username'], password=request.POST['password'])
                if user is not None:
                    if user.is_active:
                        account_login(request, user)
                        return redirect('/dashboard')

        else:
            form = AuthenticationForm()

    return render(request, 'account/login.html', {'form': form})


@csrf_protect
def register(request):
    if request.user.is_authenticated:
        return redirect('/')
    else:
        if request.method == 'POST':
            form = RegistrationForm(data=request.POST)
            if form.is_valid():
                user = form.save()
                return redirect('/account/login')

        else:
            form = RegistrationForm()

    return render(request, 'account/register.html', {'form': form})


def logout(request):
    """
    log user out
    """
    account_logout(request)
    return redirect('/account/login')
