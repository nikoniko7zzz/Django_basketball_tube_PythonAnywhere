# from django.views.generic import CreateView, UpdateView
# from django.contrib.auth.views import LoginView
# from django.contrib.auth.mixins import LoginRequiredMixin # ログインしている人だけ
# from django.contrib.auth import get_user_model
# from base.models import Profile
# from base.forms import UserCreationForm

# class SignUpView(CreateView):
#     form_class = UserCreationForm
#     success_url = '/login/'
#     template_name = 'pages/login_signup.html'

#     def form_valid(self, form):
#         return super().form_valid(form)

# class Login(LoginView):
#     template_name = 'pages/login_signup.html'

#     def form_valid(self, form):
#         return super().form_valid(form)

#     def form_invalid(self, form):
#         return super().form_invalid(form)

# # ログインしている人だけが開けるページ
# # login_requiredはdefのときに使うので
# # 今回は、クラス用のLoginRequiredMixinを使う
# class AccountUpdateView(LoginRequiredMixin, UpdateView):
#     model = get_user_model()
#     template_name = 'pages/account.html'
#     fields = ('username', 'email', )
#     success_url = '/account/' # 更新後も同じページを返す

#     def get_object(self):
#         # URL変数ではなく、現在のユーザーから直接pkを取得
#         self.kwargs['pk'] = self.request.user.pk
#         return super().get_object()

# class ProfileUpdateView(LoginRequiredMixin, UpdateView):
#     model = Profile
#     template_name = 'pages/profile.html'
#     fields = ('name', 'tel', 'birth_day')
#     success_url = '/profile/'

#     def get_object(self):
#         # URL変数ではなく、現在のユーザーから直接pkを取得
#         self.kwargs['pk'] = self.request.user.pk
#         return super().get_object()


from django.views.generic import CreateView, UpdateView
from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin # ログインしている人だけ
from django.contrib.auth import get_user_model
from base.models import Profile
from base.forms import UserCreationForm

class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = '/login/'
    template_name = 'pages/login_signup.html'

    def form_valid(self, form):
        return super().form_valid(form)

class Login(LoginView):
    template_name = 'pages/login_signup.html'

    def form_valid(self, form):
        return super().form_valid(form)

    def form_invalid(self, form):
        return super().form_invalid(form)

# ログインしている人だけが開けるページ
# login_requiredはdefのときに使うので
# 今回は、クラス用のLoginRequiredMixinを使う
class AccountUpdateView(LoginRequiredMixin, UpdateView):
    model = get_user_model()
    template_name = 'pages/account.html'
    fields = ('username', 'email', )
    success_url = '/account/' # 更新後も同じページを返す

    def get_object(self):
        # URL変数ではなく、現在のユーザーから直接pkを取得
        self.kwargs['pk'] = self.request.user.pk
        return super().get_object()

class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = Profile
    template_name = 'pages/profile.html'
    fields = ('name', 'tel', 'birth_day')
    success_url = '/profile/'

    def get_object(self):
        # URL変数ではなく、現在のユーザーから直接pkを取得
        self.kwargs['pk'] = self.request.user.pk
        return super().get_object()