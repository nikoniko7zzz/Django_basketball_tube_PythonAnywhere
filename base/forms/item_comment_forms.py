from django import forms
from base.models import Comment


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

