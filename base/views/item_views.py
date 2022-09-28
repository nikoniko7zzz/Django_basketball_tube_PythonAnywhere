# from django.shortcuts import render
from django.views.generic import ListView
from base.models import Item


class IndexListView(ListView):
    model = Item     # Itemモデルのデータを持ってくる
    template_name = 'pages/index.html'

# def index(request):
#     # object_list = Item.objects.all()　 # Itemモデルのデータを変数に入れる
#     # object_list = [

#     # ]
#     # object_list =  {'jp': 'Japan', 'us': 'America', 'fr': 'France'}
#     # context = {
#     #   'object_list': object_list,# 辞書に入れるキーは'object_list'(デフォルト)
#     # }
#     return render(request, 'pages/index.html')
#     # return render(request, 'pages/index.html', context)