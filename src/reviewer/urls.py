from django.urls import path
from . import views

app_name = 'reviewer'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('chat/', views.ChatView.as_view(), name="chat"),
    path('chat/<uuid:project_id>/<int:history_no>/', views.ProjectChatView.as_view(), name="project_chat"),
]