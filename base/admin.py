from xml.etree.ElementTree import Comment
from django.contrib import admin
from django.contrib.auth.models import Group  # 元からあるグループ
from base.models import Item, Tag, User, Profile, Comment #追加
from base.forms import UserCreationForm #追加
from django.contrib.auth.admin import UserAdmin #追加

# class TagInline(admin.TabularInline):
#     model = Item.tags.through

# class ItemAdmin(admin.ModelAdmin):
#     inlines = [TagInline] # クラスTagInlineをinlinesに渡す
#     exclude = ['tags']    # モデル作成時に作った'tags'をexclude(除外)する

# カスタムユーザー用
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
class CustomUserAdmin(UserAdmin):
    # 管理画面に表示するもの. 2段に分けて表示
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password',)}),
        (None, {'fields': ('is_active', 'is_admin',)}),
    )

    list_display = ('username', 'email', 'is_active',)
    list_filter = ()
    ordering = () # 一覧表示の並び替えのキーの設定ができる 今回未使用
    filter_horizontal = ()

    # 管理画面でユーザーを作成するときに使う項目の設定
    add_fieldsets = (
        (None, {'fields': ('username', 'email', 'is_active',)}),
    )

    # 管理画面でも自作のフォームが使える
    add_form = UserCreationForm
    # 管理画面のユーザーページに同じユーザーのプロフィールを入れる
    inlines = (ProfileInline,)



admin.site.register(Item)     # 管理者画面にモデルを反映させる
# admin.site.register(Item, ItemAdmin)     # 管理者画面にモデルを反映させる
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(User, CustomUserAdmin) # カスタムユーザーで追加
admin.site.unregister(Group)  # 元からある[グループ]を使わないので非表示に設定

# register　　...表示
# unregister ...非表示