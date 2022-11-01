from base.models import Profile
from base.views import func_dic # オリジナル関数ファイル


def save_search_conditions(self):
    '''
    検索条件の(名前と日付)をsessionに保存する
    context用
    '''

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
        self.request.session['s_period_key']= select_period
        self.request.session['s_period']= func_dic.get_name_dic(select_period)


def initial_setting_session(self):
    # sessionにデータがない時は初期設定に'すべて'という文字を指定
    if not 's_profile_pk' in self.request.session:
        self.request.session['s_profile_pk']= 'all_select'
        self.request.session['s_profile_name']= 'すべて'
    if not 's_period_key' in self.request.session:
        self.request.session['s_period_key']= 'all_select'
        self.request.session['s_period']= 'すべて'


def set_query_to_request_or_session(self):
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

    q_dic = {
        'q_profile_pk': q_profile_pk,
        'q_period_key': q_period_key,
    }
    return q_dic
