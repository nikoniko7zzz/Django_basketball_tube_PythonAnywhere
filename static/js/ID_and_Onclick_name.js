// 1. ID名とOnclick名 説明 ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
/*
★ CommentとReplyの各パーツのID ★
各パーツの配列 前(comment or reply), 後(pk)をくっつけて利用する
例: (comment + _EditTrigerBtn_ + pk),
例: (reply + _EditTrigerBtn_ + pk)
    _EditTrigerBtn_         編集ボタン EditTriger
    _Original_Text_         編集対象のコメントテキスト
    _Accordion_Form_Box_    開閉ゾーン formの箱
    _Textare_               inputできるtextare
    _CancelBtn_             キャンセルボタン
    _SubmitBtn_             送信ボタン
*/

/*
CommentとReplyの各パーツのOnclick
    EditTrigerBtn(this);    編集ボタン(formの開閉)
    resizeTextarea(this);   inputできるtextare(テキストをコピペ)
    CancelBtn(this);        キャンセルボタン(formの開閉 + inputできるtextareのクリア)
    clearText();            キャンセルボタン コメント編集の
    // SubmitBtn_(this);       編集送信ボタン(編集対象のコメントテキスト 表示)まだ実装していない
*/
