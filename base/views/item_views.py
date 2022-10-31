# from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from base.models import Item, Comment, Tag, Reply
from django.views.generic.edit import ModelFormMixin
from base.forms import CommentCreateForm, ItemCreateForm, ReplyCreateForm
from django.urls import reverse, reverse_lazy
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin # ログインしている人だけ
from base.models import Profile
import datetime
from dateutil import relativedelta




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
    reply_form_class = ReplyCreateForm
    fields = ()


    # no get_context_data override
    def post(self, request, *args, **kwargs):
        # first construct the form to avoid using it as instance
        cform = CommentCreateForm(**self.get_form_kwargs()) # Formを取得
        rform = ReplyCreateForm(**self.get_form_kwargs()) # Formを取得
        # form = self.get_form() # Formを取得
        self.object = self.get_object() # Itemのこと

        def cform_valid(self, cform):
            item = get_object_or_404(Item, pk=self.object.pk)
            comment = cform.save(commit=False)
            comment.target = item
            comment.author = self.request.user
            comment.save()
            return HttpResponseRedirect(self.get_success_url())

        def rform_valid(self, rform):
            item = get_object_or_404(Item, pk=self.object.pk)
            reply = rform.save(commit=False)
            reply.target = item
            reply.author = self.request.user
            reply.save()
            return HttpResponseRedirect(reverse('item_detail', kwargs={'pk': self.object.pk}))

        if 'CommentFormBtn' in request.POST:
            print('CommentFormBtnボタン押した')
            if cform.is_valid():
                return cform_valid(self, cform)
            else:
                return self.render_to_response(self.get_context_data())

        if 'ReplyFormBtn' in request.POST:
            if rform.is_valid():
                return rform_valid(self, rform)
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
        reply_form = self.reply_form_class(self.request.GET or None)
        context.update({
            'comment_form': comment_form,
            'reply_form':reply_form
        })
        return context





#動画一覧画面
class ItemListView(LoginRequiredMixin, ListView):
    model = Item
    #レコード情報をテンプレートに渡すオブジェクト
    context_object_name = "item_list"
    template_name = 'pages/item_list.html'

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
        return HttpResponseRedirect(reverse('item_list'))


#編集画面
class ItemUpdateView(LoginRequiredMixin, UpdateView):
    model = Item
    template_name = 'pages/item_create.html'
    form_class = ItemCreateForm
    success_url = reverse_lazy('item_list') # 更新後のページを返す


#削除画面
class ItemDeleteView(LoginRequiredMixin, DeleteView):
    model = Item
    template_name = 'pages/item_delete.html'
    fields  = ('youtube_url', 'tag', 'shooting_date', 'title', 'description')
    success_url = reverse_lazy('item_list') #削除後のリダイレクト先


# class CommentListView(ListView):
#     model = Comment
#     template_name = 'pages/comment.html'

class CommentListView(LoginRequiredMixin, ModelFormMixin, ListView):
    model = Comment
    template_name = 'pages/comment.html'
    # context_object_name = 'comment_objects'
    form_class = CommentCreateForm
    success_url = reverse_lazy('comment')

    def get(self, request, *args, **kwargs):
        self.object = None
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = None
        self.object_list = self.get_queryset()
        form = self.get_form()

        def form_valid(self, form):
            comment = form.save(commit=False)
            comment.author = self.request.user
            comment.save()
            print('保存しました')
            return HttpResponseRedirect(reverse('comment'))

        if form.is_valid():
            return form_valid(self, form)
        else:
            return self.form_invalid(form)

    def get_queryset(self):
        # アップデート順に表示 新しいのが上
        return Comment.objects.filter().order_by('-updated_at')


class EveryoneCommentListView(LoginRequiredMixin, ListView):
    model = Comment
    template_name = 'pages/everyone_comment.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        # ユーザーの名前を返す(抽出条件select用)
        profiles = Profile.objects.all()
        context['profiles'] = profiles

        # 検索条件の名前の値をsessionに保存する
        if self.request.GET.get('select_profile_pk'):
            profile_pk = self.request.GET.get('select_profile_pk')
            if profile_pk == 'all_select':
                self.request.session['s_profile_pk'] = profile_pk
                self.request.session['s_profile_name'] = 'すべて'
            else:
                profile = Profile.objects.get(pk=profile_pk)
                self.request.session['s_profile_pk'] = profile_pk
                self.request.session['s_profile_name'] = profile.name

        # 検索条件の日付の値をsessionに保存する
        if self.request.GET.get('select_period_key'):
            select_period = self.request.GET.get('select_period_key')
            name_dic = {
                'today_select': '今日',
                'yesterday_select': '昨日',
                'one_week_before': '１週間以内',
                'one_month_before': '１ヶ月以内',
                'one_year_before': '１年以内',
                'all_select': 'すべて',
            }
            self.request.session['s_period_key']= select_period
            self.request.session['s_period']= name_dic[select_period]

        # sessionの値をテンプレートにかえす
        context['s_profile_pk'] = self.request.session['s_profile_pk']
        context['s_profile_name'] = self.request.session['s_profile_name']
        context['s_period_key'] = self.request.session['s_period_key']
        context['s_period'] = self.request.session['s_period']

        return context


    def get_queryset(self):
        # 出力期間を算出する、辞書で呼び出し
        today = datetime.date.today()
        yesterday = today - datetime.timedelta(days=1)
        week = today - datetime.timedelta(weeks=1)
        month = today - relativedelta.relativedelta(months=1)
        year = today - relativedelta.relativedelta(years=1)
        date_dic = {
            'today_select': today, # 今日
            'yesterday_select': yesterday, # 昨日
            'one_week_before': week, # １週間以内
            'one_month_before': month, # １ヶ月以内
            'one_year_before': year, # １年以内
        }

        # sessionにデータがない時は初期設定に'すべて'という文字を指定
        if not 's_profile_pk' in self.request.session:
            self.request.session['s_profile_pk']= 'all_select'
            self.request.session['s_profile_name']= 'すべて'
        if not 's_period_key' in self.request.session:
            self.request.session['s_period_key']= 'all_select'
            self.request.session['s_period']= 'すべて'

        # self.request.GET.get(検索値)がないものは、sessionの値を検索値に入れる
        if self.request.GET.get('select_profile_pk') and self.request.GET.get('select_period_key'):
            q_profile_pk = self.request.GET.get('select_profile_pk')
            q_period_key = self.request.GET.get('select_period_key')
        elif self.request.GET.get('select_profile_pk'):
            q_profile_pk = self.request.GET.get('select_profile_pk')
            q_period_key = self.request.session['s_period_key']
        elif self.request.GET.get('select_period_key'):
            q_profile_pk = self.request.session['s_profile_pk']
            self.request.GET.get('select_period_key')
        else:
            q_profile_pk = self.request.session['s_profile_pk']
            q_period_key = self.request.session['s_period_key']

        # 検索値に応じてobject_listの作成
        if q_profile_pk == 'all_select' and q_period_key == 'all_select' :
            object_list = Comment.objects.all().order_by('-created_at')
        elif q_profile_pk == 'all_select':
            object_list = Comment.objects.filter(created_at__gte=date_dic[q_period_key]).order_by('-created_at')
        elif q_period_key == 'all_select':
            object_list = Comment.objects.filter(author=q_profile_pk).order_by('-created_at')
        else:
            object_list = Comment.objects.filter(author=q_profile_pk, created_at__gte=date_dic[q_period_key]).order_by('-created_at')

        return object_list