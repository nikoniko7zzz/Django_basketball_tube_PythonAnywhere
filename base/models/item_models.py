from django.db import models
from django.utils.crypto import get_random_string #ランダム文字列作成 id用


def create_id():
    return get_random_string(22) # 22文字のランダムな文字列を作る
# idをランダムにすると、ユーザーに予測がされにくくい


class Tag(models.Model):
    slug = models.CharField(max_length=32, primary_key=True) # slug:id
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Item(models.Model):
		# default=create_id 関数を呼び出す
		# editable=False 修正不可(管理画面でも)
    id = models.CharField(default=create_id, primary_key=True, max_length=22, editable=False)
    title = models.CharField(default='', max_length=200)
        # PositiveIntegerField 正の整数
    description = models.TextField(default='', blank=True) # 説明(詳細)
    created_at = models.DateTimeField(auto_now_add=True) # 作成日 自動作成
    updated_at = models.DateTimeField(auto_now=True) ## 更新日 自動作成
    youtube_url = models.CharField(default='', max_length=200)
    # ManyToManyField	多対多
    tags = models.ManyToManyField(Tag) # タグは複数付けれるので複数形


    def __str__(self):
        return self.title
