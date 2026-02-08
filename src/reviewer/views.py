from django.shortcuts import render
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin

class IndexView(generic.TemplateView):
    template_name = "index.html"

class ChatView(LoginRequiredMixin, generic.TemplateView):
    template_name = "chat.html"