from django.db import models
from accounts.models import CustomUser
import uuid

class Project(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.PROTECT)
    project_id = models.UUIDField(verbose_name='プロジェクトID', default=uuid.uuid4, editable=False)
    title = models.TextField(verbose_name='プロジェクト名', max_length=100)
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Project'
    
    def __str__(self):
        return self.title

class History(models.Model):
    project = models.ForeignKey(Project, verbose_name='プロジェクト', on_delete=models.CASCADE, related_name="histories")
    history_no = models.IntegerField(verbose_name='履歴番号')
    file = models.FileField(verbose_name='Latexファイル', upload_to='latex/')
    original_text = models.TextField(verbose_name='Latex内テキスト')
    advice_text = models.TextField(verbose_name='アドバイステキスト')

    class Meta:
        verbose_name_plural = 'History'

    def __str__(self):
        return str(self.history_no)