from django.db import models
from accounts.models import CustomUser

class Project(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.PROTECT)
    title = models.TextField(verbose_name='プロジェクト名', max_length=100)
    version_count = models.IntegerField(verbose_name='履歴数', null=False, default=0)

    class Meta:
        verbose_name_plural = 'Project'
    
    def __str__(self):
        return self.title

class History(models.Model):
    project = models.ForeignKey(Project, verbose_name='プロジェクト', on_delete=models.CASCADE, related_name="histories")
    history_no = models.IntegerField(verbose_name='履歴番号', null=False)
    file = models.FileField(upload_to='latex/')
    original_text = models.TextField(null=False)
    advice_text = models.TextField(null=False)

    class Meta:
        verbose_name_plural = 'History'

    def __str__(self):
        return self.history_no