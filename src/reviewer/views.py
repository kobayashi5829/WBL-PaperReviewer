from django.shortcuts import render
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Project

class IndexView(generic.TemplateView):
    template_name = "index.html"

class ChatView(LoginRequiredMixin, generic.ListView):
    model = Project
    template_name = "chat.html"

    def get_queryset(self):
        projects = Project.objects.filter(user=self.request.user).order_by('created_at')
        return projects

class ProjectChatView(LoginRequiredMixin, generic.ListView, generic.DetailView):
    model = Project
    template_name = "project_chat.html"
    