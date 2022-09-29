# from django.shortcuts import render
from django.views.generic import ListView, DetailView
from base.models import Item


class IndexListView(ListView):
    model = Item     # Itemモデルのデータを持ってくる
    template_name = 'pages/index.html'


# Itemモデルのpkをもとに個別データを返す
class ItemDetailView(DetailView):
    model = Item
    template_name = 'pages/item.html'