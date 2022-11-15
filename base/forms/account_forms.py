from django import forms
from django.contrib.auth import get_user_model
from base.models import Profile
from django.contrib.admin.widgets import AdminDateWidget
from datetime import date


class UserCreationForm(forms.ModelForm):
    password = forms.CharField()

    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password', )
        # labels = {'username':'ユーザーネーム', 'email':'email', 'password':'パスワード' }

    def clean_password(self):
        # cleaned_dataにはformの中で 検証された後適切なデータとして確認されたデータが入ります。
        password = self.cleaned_data.get("password")
        return password

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user




class ProfileCreateForm(forms.ModelForm):
    """動画投稿フォーム"""

    class Meta:
        model = Profile

        # select中身作成
        this_year = date.today().year
        year_range = [x for x in range(this_year - 18, this_year -15)]

        # 表示順番
        fields  = ('name', 'tel', 'birth_day', )
        labels = {'name': '名前', 'tel': '電話番号', 'birth_day': '誕生日',}
        widgets = {
            'name': forms.TextInput(
                attrs={'class': 'form-control mb-3', 'placeholder': '',}),
            'tel': forms.TextInput(
                attrs={'class': 'form-control mb-3',}),
            'birth_day': forms.SelectDateWidget(years=year_range,
                attrs={'class': 'form-select inline_block_select ml-2 mb-3',}),
        }

