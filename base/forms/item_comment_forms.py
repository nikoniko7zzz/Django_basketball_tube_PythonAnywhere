from django import forms
from base.models import Comment, Reply


class CommentCreateForm(forms.ModelForm):
    """コメント投稿フォーム"""
    class Meta:
        model = Comment
        fields  = ('comment_text',)
        labels = {'comment_text': '',}
        widgets = {
            'comment_text': forms.Textarea(
                attrs={'class': 'form-control my-3', 'placeholder': 'コメントする', 'rows':'1', 'oninput':'resizeCommentTextarea();', }),
        }


class ReplyCreateForm(forms.ModelForm):
    """返信コメント投稿フォーム"""
    class Meta:
        model = Reply
        fields  = ('comment_text', 'comment_to')
        labels = {'comment_text': '',}
        widgets = {
            'comment_text': forms.Textarea(
                attrs={'class': 'form-control my-3', 'placeholder': '返信する', 'rows':'1', 'oninput':'resizeCommentTextarea();', }),
            # 'comment_to'は、ForeignKey(Comment)なので、入力しないが、値はテンプレートからviewに運ぶので、非表示としてfieldを作っておく
            'comment_to': forms.HiddenInput(),
        }

