from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from base.models import create_id # item_models.py のcreate_id関数(22文字のランダムな文字列を作る)
# from datetime import date # 年齢計算用
# from dateutil.relativedelta import relativedelta # 年齢計算用

# Djangoのユーザーモデルをカスタマイズ

class UserManager(BaseUserManager):
    # usernameとemailでログインする
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(
            username,
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

# ユーザーのコア情報
class User(AbstractBaseUser):
    id = models.CharField(default=create_id, primary_key=True, max_length=22)
    username = models.CharField(
        max_length=50, unique=True, blank=True, default='匿名')
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', ]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


"""今回は作らない"""
# # 学年計算関数：今年の4月1日での年齢を出して学年に変えている
# def age_calculator(birthday):
#     SCHOOL_YEAR = {
#         17:'高3',
#         16:'高2',
#         15:'高1',
#         14:'中3',
#         13:'中2',
#         12:'中1',
#     }
#     BASIS_DATE = date(date.today().year,4,1)
#     dy = relativedelta(BASIS_DATE, birthday)
#     return SCHOOL_YEAR[dy.years]
#     # birthday = date(2006,10,21)
#     # print(age_calculator(birthday)) -> '高1'


#ユーザーのプロフィール ユーザーコア情報と紐づいている
# blank=True 任意で入力でOK (注文時には空白NGとする)
class Profile(models.Model):
    # OneToOneField 1対1で紐づく.
    # on_delete=models.CASCADE ユーザーコア情報が削除されたらプロフィールも削除するよ
    user = models.OneToOneField(
        User, primary_key=True, on_delete=models.CASCADE)
    name = models.CharField(default='', blank=True, max_length=50) # 名前(宛名)
    tel = models.CharField(default='', blank=True, max_length=15) # tel
    # Birthday = models.DateField()
    # 日付の形式のテキストのみ入力可能。	2021-02-10
    # birth_day = models.DateField(verbose_name='誕生日', blank=True, null=True) # 生年月日
    birth_day = models.DateField(blank=True, null=True) # 生年月日
    # 0 ～ 32767 の 整数
    # uniform_num = models.PositiveSmallIntegerField(default='', blank=True, max_length=3) # ユニフォーム番号
    # school_year = models.CharField(default=age_calculator(birthday)) # 学年
    created_at = models.DateTimeField(auto_now_add=True) # 作成日
    updated_at = models.DateTimeField(auto_now=True) # 更新日

    def __str__(self):
        return self.name

# ユーザーコア情報作成時にプロフィールも同時に作れる
# OneToOneFieldを同時に作成
@receiver(post_save, sender=User) # Userモデルが入力保存されたときに実行する
def create_onetoone(sender, **kwargs):
    if kwargs['created']:
        Profile.objects.create(user=kwargs['instance'])