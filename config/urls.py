"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from base import views
from django.contrib.auth.views import LogoutView # 追加 viewは自作せずdjangoの機能を使う

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', views.IndexListView.as_view()),  # トップページ
    path('comment/', views.CommentListView.as_view(), name="comment"),  # 自分のコメントページ
    path('everyone/', views.EveryoneCommentListView.as_view()),  # 自分のコメントページ
    path('items/<str:pk>/', views.ItemDetailView.as_view(), name="item_detail"),
    path('tags/<str:pk>/', views.TagListView.as_view()), # 選択タグの動画表示

    # Account 追加
    path('login/', views.Login.as_view()),
    path('logout/', LogoutView.as_view()),
    path('signup/', views.SignUpView.as_view()),
    path('account/', views.AccountUpdateView.as_view()),
    path('profile/', views.ProfileUpdateView.as_view()),
]
