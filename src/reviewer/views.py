from django.shortcuts import get_object_or_404
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

class ProjectChatView(LoginRequiredMixin, generic.DetailView):
    model = Project
    template_name = "project_chat.html"
    context_object_name = "project"

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def get_object(self):
        project = get_object_or_404(
            Project,
            id = self.kwargs["project_id"],
            user=self.request.user
        )
        return project

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        history = get_object_or_404(
            self.object.histories,
            no = self.kwargs["history_no"]
        )

        context["history"] = history
        context["histories"] = self.object.histories.all().order_by('history_no')

        return context
