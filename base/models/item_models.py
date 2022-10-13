from django.db import models
from base.models import create_id # item_models.py のcreate_id関数(22文字のランダムな文字列を作る)
from .account_models import User

class Tag(models.Model):
    slug = models.CharField(max_length=32, primary_key=True) # slug:id
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Item(models.Model):
		# default=create_id 関数を呼び出す
		# editable=False 修正不可(管理画面でも)
    id = models.CharField(default=create_id, primary_key=True, max_length=22, editable=False)
    tag =models.ForeignKey(Tag, on_delete=models.CASCADE)
    # tags = models.ManyToManyField(Tag) # タグは複数付けれるので複数形
    title = models.CharField(default='', max_length=200) # タイトル 試合内容＆対戦相手
    shooting_date = models.DateField(blank=True, null=True) # 撮影日
        # PositiveIntegerField 正の整数
    description = models.TextField(default='', blank=True, max_length=1000) # 説明(詳細)
    youtube_url = models.CharField(default='', max_length=11) # youtube idのみ登録
    # ManyToManyField	多対多
    author = models.ForeignKey(User, on_delete=models.CASCADE) # 投稿者Userモデルpk
    created_at = models.DateTimeField(auto_now_add=True) # 作成日 自動作成
    updated_at = models.DateTimeField(auto_now=True) ## 更新日 自動作成

    class Meta:
        ordering = ['-updated_at'] # 更新順

    def __str__(self):
        return self.title
