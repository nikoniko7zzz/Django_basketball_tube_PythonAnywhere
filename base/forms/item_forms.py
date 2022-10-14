from django import forms
from base.models import Item


class ItemCreateForm(forms.ModelForm):
    """動画投稿フォーム"""

    class Meta:
        model = Item
        # 表示順番
        fields  = ('youtube_url', 'tag', 'shooting_date', 'title', 'description')
        labels = {'youtube_url':'Youtube ID', 'tag':'タグ', 'shooting_date':'撮影日', 'title':'動画タイトル', 'description':'動画説明'}
        widgets = {
            'youtube_url': forms.TextInput(
                attrs={'class': 'form-control mb-3  col-md-4', 'placeholder': '英数字11文字 (https://youtu.be/ここの部分)',}),
            'tag': forms.Select(
                attrs={'class': 'form-control mb-3 col-md-4',}),
            'shooting_date': forms.DateTimeInput(
                attrs={'class': 'form-control mb-3  col-md-4','type':'date',}),
            'title': forms.TextInput(
                attrs={'class': 'form-control mb-3', 'placeholder': '試合名, 対戦相手 など',}),
            'description': forms.Textarea(
                attrs={'class': 'form-control mb-3', 'placeholder': '動画詳細を入力してください', 'rows':'1', 'oninput':"resizeItemTextarea();",}),
        }






