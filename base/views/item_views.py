# from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.views.generic.edit import ModelFormMixin
from base.models import Item, Comment, Tag, Reply, Profile
from base.forms import CommentCreateForm, ItemCreateForm, ReplyCreateForm, CommentUpdateForm, ReplyUpdateForm
from django.urls import reverse, reverse_lazy
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin # ログインしている人だけ
from base.views import func_dic # オリジナル関数ファイル
from base.views import search_condition as sc # オリジナル関数ファイル
from datetime import datetime
from django.contrib import messages




class IndexListView(LoginRequiredMixin, ListView):
    model = Item     # Itemモデルのデータを持ってくる
    template_name = 'pages/index.html'
    context_object_name = 'item_list'
    paginate_by = 8
    # paginate_by = 2 # テスト用

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['tag_list'] = Tag.objects.all
        context['total_item'] = Item.objects.all().count()
        return context


class TagListView(IndexListView, ListView):
    paginate_by = 8
    # paginate_by = 2 # テスト用

    def get_queryset(self): # get_queryset の上書き
        self.tag = Tag.objects.get(slug=self.kwargs['pk'])
        return Item.objects.filter(tag=self.tag)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['total_item'] = Item.objects.filter(tag=self.tag).count()
        self.tag = Tag.objects.get(slug=self.kwargs['pk'])
        context['tag_name'] = self.tag
        return context



# Itemモデルのpkをもとに個別データを返す
# class ItemDetailView(DetailView):
#     model = Item
#     template_name = 'pages/item.html'



class ItemDetailView(ModelFormMixin, DetailView):
    """
    個別の動画ページ(item_detail.html)
    動画(Itemモデル)DetailViewとコメント投稿フォーム
    投稿->保存->リダイレクト
    """
    model = Item
    template_name = 'pages/item_detail.html'
    context_object_name = 'item'
    comment_form_class = CommentCreateForm
    comment_update_form_class = CommentUpdateForm
    reply_form_class = ReplyCreateForm
    reply_update_form_class = ReplyUpdateForm
    fields = () # 必要


    # no get_context_data override
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

    def get_success_url(self):
        return reverse('item_detail', kwargs={'pk': self.object.pk})

    # 動画に紐づいたコメント数を返す
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        item = get_object_or_404(Item, pk=self.object.pk)
        self.target = item.pk

        context['comment_count'] = Comment.objects.filter(target=self.target).count() # これもテンプレートで集計でもいいな
        comment_form = self.comment_form_class(self.request.GET or None)
        comment_update_form = self.comment_update_form_class(self.request.GET or None)
        reply_form = self.reply_form_class(self.request.GET or None)
        reply_update_form = self.reply_update_form_class(self.request.GET or None)
        context.update({
            # 'comment_form': comment_form,
            'form': comment_form,
            'comment_update_form,': comment_update_form,
            'reply_form':reply_form,
            'reply_update_form,': reply_update_form,
        })
        return context





#動画一覧画面
class ItemListView(LoginRequiredMixin, ListView):
    model = Item
    #レコード情報をテンプレートに渡すオブジェクト
    context_object_name = "item_list"
    template_name = 'pages/item_list.html'
    paginate_by = 20


    def get_queryset(self):
        # アップデート順に表示 新しいのが上
        return Item.objects.filter().order_by('-updated_at')


# 動画登録画面
class ItemCreateView(LoginRequiredMixin, CreateView):
    model = Item
    template_name = 'pages/item_create.html'
    form_class = ItemCreateForm

    # form_valid関数をオーバーライドすることで、更新するフィールドと値を指定できる
    def form_valid(self, form):
        item = form.save(commit=False)
        item.author = self.request.user
        item.save()
        messages.success(self.request, '動画を追加しました')
        return HttpResponseRedirect(reverse('item_list'))


#編集画面
class ItemUpdateView(LoginRequiredMixin, UpdateView):
    model = Item
    template_name = 'pages/item_create.html'
    form_class = ItemCreateForm
    success_url = reverse_lazy('item_list') # 更新後のページを返す

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        messages.success(self.request, '動画を更新しました。')
        return super().post(request, *args, **kwargs)


#削除画面
class ItemDeleteView(LoginRequiredMixin, DeleteView):
    model = Item
    template_name = 'pages/item_delete.html'
    fields  = ('youtube_url', 'tag', 'shooting_date', 'title', 'description')
    success_url = reverse_lazy('item_list') #削除後のリダイレクト先

    def post(self, request, *args, **kwargs):
        messages.success(self.request, '動画を削除しました。')
        return self.delete(request, *args, **kwargs)


# class CommentListView(ListView):
#     model = Comment
#     template_name = 'pages/comment.html'

class CommentListView(LoginRequiredMixin, ModelFormMixin, ListView):
    model = Comment
    template_name = 'pages/comment.html'
    context_object_name = 'comment_objects'
    comment_form_class = CommentCreateForm
    comment_update_form_class = CommentUpdateForm
    reply_form_class = ReplyCreateForm
    reply_update_form_class = ReplyUpdateForm
    fields = () # 必要
    # form_class = CommentCreateForm
    success_url = reverse_lazy('comment')

    def get(self, request, *args, **kwargs):
        self.object = None
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        cform = CommentCreateForm(**self.get_form_kwargs()) # Formを取得
        cuform = CommentUpdateForm(**self.get_form_kwargs()) # Formを取得
        rform = ReplyCreateForm(**self.get_form_kwargs()) # Formを取得
        ruform = ReplyUpdateForm(**self.get_form_kwargs()) # Formを取得
        # form = self.get_form() # Formを取得

        def cform_valid(self, cform):
            comment = cform.save(commit=False)
            comment.author = self.request.user
            comment.save()
            return HttpResponseRedirect(reverse('comment'))

        def cuform_valid(self, cuform):
            update_comment_text = cuform.cleaned_data.get('update_comment_text')
            update_id = cuform.cleaned_data.get('update_id')
            comment = Comment.objects.get(pk=update_id)
            comment.comment_text = update_comment_text # 上書き
            comment.updated_at = datetime.now() # 上書き
            comment.save()
            return HttpResponseRedirect(reverse('comment'))

        def rform_valid(self, rform):
            reply = rform.save(commit=False)
            reply.author = self.request.user
            reply.save()
            return HttpResponseRedirect(reverse('comment'))

        def ruform_valid(self, ruform):
            update_comment_text = ruform.cleaned_data.get('update_comment_text')
            update_id = ruform.cleaned_data.get('update_id')
            reply = Reply.objects.get(pk=update_id)
            reply.comment_text = update_comment_text # 上書き
            reply.updated_at = datetime.now() # 上書き
            reply.save()
            return HttpResponseRedirect(reverse('comment'))


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

    def get_queryset(self):
        # アップデート順に表示 新しいのが上
        return Comment.objects.filter().order_by('-updated_at')

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        comment_form = self.comment_form_class(self.request.GET or None)
        comment_update_form = self.comment_update_form_class(self.request.GET or None)
        reply_form = self.reply_form_class(self.request.GET or None)
        reply_update_form = self.reply_update_form_class(self.request.GET or None)
        context.update({
            # 'comment_form': comment_form,
            'form': comment_form,
            'comment_update_form,': comment_update_form,
            'reply_form':reply_form,
            'reply_update_form,': reply_update_form,
        })
        return context


class EveryoneCommentListView(LoginRequiredMixin, ModelFormMixin, ListView):
    model = Comment
    context_object_name = 'comment_objects'
    template_name = 'pages/everyone_comment.html'
    reply_form_class = ReplyCreateForm
    reply_update_form_class = ReplyUpdateForm
    fields = () # 必要

    def get(self, request, *args, **kwargs):
        self.object = None
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        rform = ReplyCreateForm(**self.get_form_kwargs()) # Formを取得
        ruform = ReplyUpdateForm(**self.get_form_kwargs()) # Formを取得
        # form = self.get_form() # Formを取得

        def rform_valid(self, rform):
            reply = rform.save(commit=False)
            reply.author = self.request.user
            reply.save()
            return HttpResponseRedirect(reverse('e_comment'))

        def ruform_valid(self, ruform):
            update_comment_text = ruform.cleaned_data.get('update_comment_text')
            update_id = ruform.cleaned_data.get('update_id')
            reply = Reply.objects.get(pk=update_id)
            reply.comment_text = update_comment_text # 上書き
            reply.updated_at = datetime.now() # 上書き
            reply.save()
            return HttpResponseRedirect(reverse('e_comment'))

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

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        # ユーザーの名前を返す(抽出条件select用)
        profiles = Profile.objects.all()
        context['profiles'] = profiles

        # 検索条件の(名前と日付)をsessionに保存する(selectタグの中身の保持用)
        sc.save_search_conditions(self)
        # sessionの値をテンプレートにかえす
        context['s_profile_pk'] = self.request.session['s_profile_pk']
        context['s_profile_name'] = self.request.session['s_profile_name']
        context['s_period_key'] = self.request.session['s_period_key']
        context['s_period'] = self.request.session['s_period']
        # formをテンプレートにかえす
        reply_form = self.reply_form_class(self.request.GET or None)
        reply_update_form = self.reply_update_form_class(self.request.GET or None)
        context.update({
            # 'comment_form': comment_form,
            'reply_form':reply_form,
            'reply_update_form,': reply_update_form,
        })
        return context

    def get_queryset(self):
        # sessionにデータがない時は初期設定に'すべて'という文字を指定
        sc.initial_setting_session(self)

        # self.request.GET.get(検索値)がないものは、sessionの値を検索値に入れる
        q_dic = sc.set_query_to_request_or_session(self)
        q_profile_pk = q_dic['q_profile_pk']
        q_period_key = q_dic['q_period_key']

        # 検索値に応じてobject_listの作成
        if q_profile_pk == 'all_select' and q_period_key == 'all_select' :
            object_list = Comment.objects.all().order_by('-created_at')
        elif q_profile_pk == 'all_select':
            object_list = Comment.objects.filter(created_at__gte=func_dic.get_date_dic(q_period_key)).order_by('-created_at')
        elif q_period_key == 'all_select':
            object_list = Comment.objects.filter(author=q_profile_pk).order_by('-created_at')
        else:
            object_list = Comment.objects.filter(author=q_profile_pk, created_at__gte=func_dic.get_date_dic(q_period_key)).order_by('-created_at')
        return object_list