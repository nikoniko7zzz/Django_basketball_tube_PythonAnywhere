from django import forms
from base.models import Comment


class CommentCreateForm(forms.ModelForm):
    """コメント投稿フォーム"""
    class Meta:
        model = Comment
        widgets = {
            'comment_text': forms.TextInput(
                attrs={
                    'placeholder': 'コメントする',
                    'class': 'form-control',
        })}
        # exclude:フォーム画面では表示されない
        exclude = ('author','target', 'created_at', 'updated_at')
