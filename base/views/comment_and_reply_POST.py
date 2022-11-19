# 使わんかったファイル
from base.forms import CommentCreateForm, ReplyCreateForm, CommentUpdateForm, ReplyUpdateForm
from base.models import Item, Comment, Reply
from datetime import datetime
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404

from django.urls import reverse


def post(self, request, *args, **kwargs):
    # first construct the form to avoid using it as instance
    cform = CommentCreateForm(**self.get_form_kwargs()) # Formを取得
    cuform = CommentUpdateForm(**self.get_form_kwargs()) # Formを取得
    rform = ReplyCreateForm(**self.get_form_kwargs()) # Formを取得
    ruform = ReplyUpdateForm(**self.get_form_kwargs()) # Formを取得
    # form = self.get_form() # Formを取得
    self.object = self.get_object() # Itemのこと

    def cform_valid(self, cform):
        item = get_object_or_404(Item, pk=self.object.pk)
        comment = cform.save(commit=False)
        comment.target = item
        comment.author = self.request.user
        comment.save()
        return HttpResponseRedirect(self.get_success_url())

    def cuform_valid(self, cuform):
        # item = get_object_or_404(Item, pk=self.object.pk) # Redirect用
        update_comment_text = cuform.cleaned_data.get('update_comment_text')
        update_id = cuform.cleaned_data.get('update_id')
        comment = Comment.objects.get(pk=update_id)
        comment.comment_text = update_comment_text # 上書き
        comment.updated_at = datetime.now() # 上書き
        comment.save()
        return HttpResponseRedirect(reverse('item_detail', kwargs={'pk': self.object.pk}))

    def rform_valid(self, rform):
        item = get_object_or_404(Item, pk=self.object.pk)
        reply = rform.save(commit=False)
        reply.target = item
        reply.author = self.request.user
        reply.save()
        return HttpResponseRedirect(reverse('item_detail', kwargs={'pk': self.object.pk}))

    def ruform_valid(self, ruform):
        update_comment_text = ruform.cleaned_data.get('update_comment_text')
        update_id = ruform.cleaned_data.get('update_id')
        reply = Reply.objects.get(pk=update_id)
        reply.comment_text = update_comment_text # 上書き
        reply.updated_at = datetime.now() # 上書き
        reply.save()
        return HttpResponseRedirect(reverse('item_detail', kwargs={'pk': self.object.pk}))


    if 'CommentFormBtn' in request.POST:
        # print('CommentFormBtnボタン押した')
        if cform.is_valid():
            return cform_valid(self, cform)
        else:
            return self.render_to_response(self.get_context_data())

    if 'CommentUpdateFormBtn' in request.POST:
        if cuform.is_valid():
            return cuform_valid(self, cuform)
        else:
            return self.render_to_response(self.get_context_data())

    if 'ReplyFormBtn' in request.POST:
        if rform.is_valid():
            return rform_valid(self, rform)
        else:
            return self.render_to_response(self.get_context_data())

    if 'ReplyUpdateFormBtn' in request.POST:
        if ruform.is_valid():
            return ruform_valid(self, ruform)
        else:
            return self.render_to_response(self.get_context_data())
