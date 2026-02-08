from django.shortcuts import render
from allauth.account.views import LoginView, LogoutView
from allauth.account.forms import LoginForm
from django.contrib import messages

class CustomLoginView(LoginView):
    template_name = "account/login.html"
    form_class = LoginForm

    def form_valid(self, form):
        response = super().form_valid(form)
        storage = messages.get_messages(self.request)
        list(storage)
        return response

class CustomLogoutView(LogoutView):
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        storage = messages.get_messages(request)
        list(storage)
        return response