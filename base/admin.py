from django.contrib import admin
from base.models import Item, Tag   # モデルを読み込む
from django.contrib.auth.models import Group  # 元からあるグループ


class TagInline(admin.TabularInline):
    model = Item.tags.through

class ItemAdmin(admin.ModelAdmin):
    inlines = [TagInline] # クラスTagInlineをinlinesに渡す
    exclude = ['tags']    # モデル作成時に作った'tags'をexclude(除外)する

admin.site.register(Item, ItemAdmin)     # 管理者画面にモデルを反映させる
admin.site.register(Tag)
admin.site.unregister(Group)  # 元からある[グループ]を使わないので非表示に設定

# register　　...表示
# unregister ...非表示