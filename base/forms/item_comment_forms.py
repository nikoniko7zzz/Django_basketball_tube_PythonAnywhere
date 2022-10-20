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
                attrs={'class': 'form-control my-3', 'placeholder': 'コメントする', 'rows':'1', 'oninput':'resizeCommentTextarea()', }),
        }


class ReplyCreateForm(forms.ModelForm):
    """返信コメント投稿フォーム"""
    class Meta:
        model = Reply
        fields  = ('comment_text', 'comment_to')
        widgets = {
            'comment_text': forms.HiddenInput(),
            'comment_to': forms.HiddenInput(),
        }

# ＊＊＊ ReplyCreateFormについて ＊＊＊
# 'comment_text'は、javascript(テキストエリアの拡大)でCommentIDを使うので、テンプレートでIDを取得しjsに渡すので、ここでは非表示としてfieldを作っておく
# 'comment_to'は、ForeignKey(Comment)なので、入力しないが、値はテンプレートからviewに運ぶので、非表示としてfieldを作っておく

