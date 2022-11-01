import datetime
from dateutil import relativedelta

def aaa():
    return print('func_dicのaaa()関数を実行しました')

def get_name_dic(key):
    '''出力期間を表示するために表示言葉を辞書で呼び出し'''
    name_dic = {
        'today_select': '今日',
        'yesterday_select': '昨日',
        'one_week_before': '１週間以内',
        'one_month_before': '１ヶ月以内',
        'one_year_before': '１年以内',
        'all_select': 'すべて',
    }
    ansewr = name_dic[key]
    return ansewr


def get_date_dic(key):
    '''出力期間を算出する、辞書で呼び出し'''
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
    ansewr = date_dic[key]
    return ansewr