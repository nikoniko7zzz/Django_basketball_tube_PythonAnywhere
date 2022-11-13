/*
  内容
    - 改行で自動で大きさが変わるtextarea(全てのtextarea)
    - commentに紐ずく動画がないときはリンクボタンを非表示にする(comment.html, everyone_comment.html )
    - ボタンの内容のテキストをtextareaのカーソル位置に挿入(comment.html(入力補完用))
    - 「編集ボタン」を押した後の動き(コメント・返信 共通)
    - 「キャンセルボタン」を押した後の動き
    - 3秒後に消えるbootstrap toast Message(ログインしましたなどのメッセージ)
*/


console.log("Hello Start");

/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    改行で自動で大きさが変わるtextarea                  ＊
    全てのtextarea                                      ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/
const resizeTextarea = (e) => {
  const textarea_id = e.id
  // console.log(textarea_id);
  const textarea = document.getElementById(textarea_id);
  console.log(textarea);
  //- 改行に合わせてテキストエリアのサイズ変更
  const PADDING_Y = 20;
  let lineHeight = getComputedStyle(textarea).lineHeight;
  lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
  const lines = (textarea.value + '\n').match(/\n/g).length;
  textarea.style.height = lineHeight * lines + PADDING_Y + 'px';
  console.log(lineHeight * lines + PADDING_Y + 'px');
};


/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    クリックしたボタンのIDをバラして利用しやすくする    ＊
    全てのクリックイベント                              ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/
// const settingで使う
const get_btn_id_dic = (button_id) => {
  const btn_id_array = button_id.split( '_' );
  const btn_id_dic = {
    'target': btn_id_array[0],
    'btn_name': btn_id_array[1], // 使わないけど格納だけ
    'pk_num': btn_id_array[2],
  };
  return btn_id_dic;
  // dic = {target: 'comment', btn_name: 'EditTrigerBtn', pk_num: '74'}
};


/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    commentに紐ずく動画がないときはリンクボタンを非表示にする ＊
    comment.html, everyone_comment.html                       ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/

window.onload = function onLoad() {
  const link = document.querySelectorAll("#comment_to_detail_link");
  const linkBox = document.querySelectorAll("#comment_to_detail_link_box");
  // console.log(linkBox.length);
  // console.log(link.length);
  for(let i=0; i<link.length;i++){
    if (link[i].innerHTML=='None'){
      // console.log(link[i].innerHTML);
      // console.log('非表示にします');
      linkBox[i].style.display ="none";
    }
  }
}

/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    ボタンの内容のテキストをtextareaのカーソル位置に挿入      ＊
    comment.html(入力補完用)                                  ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/
function addText(e){
  // const btn_value = btn.id; // eleのプロパティとしてidを取得
	const text = e.value;
	//テキストエリアと挿入する文字列を取得
	const area = document.getElementById('id_comment_text');
	//カーソルの位置を基準に前後を分割して、その間に文字列を挿入
	area.value = area.value.substr(0, area.selectionStart)
			+ text
			+ area.value.substr(area.selectionStart);
}


/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
★ 編集ボタンを押したら 〜
対応のAccordion_Boxが開閉する
編集 <---> 閉じる と、ボタンの表示が切り替わる
編集対象のコメントテキスト と inputできるtextareの動き

  1. ID名とOnclick名 説明
        (CommentとReplyの各パーツのIDとOnclickネーム)
  2. クリックボタンのidから、comment or replyを判断し、各アイテムを取得し辞書でかえす
  3. アコーディオンの動き
        ボタンの修正後のテキストの表示切替
        入力フォームの表示切替
        編集対象のコメントテキストの表示切替
  4. inputできるtextareの動き
        編集対象のコメントテキストをinputできるtextareにコピペして編集しやすくする
        改行で自動で大きさが変わるtextarea(ファイル上部で作成済み分)

＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/

// 編集ボタンを押した後の動き
const EditTrigerBtn = (e) => {
  const set_dic = setting(e);       // 1
  moveAccordionFormBox(set_dic)    // 2
  editTextarea(set_dic)            // 3
  resizeTextarea(set_dic.area)     // 4
};



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


// 2. クリックボタンのidから、comment or replyを判断し、各アイテムを取得し辞書でかえす *
const setting = (e) => {
  const button_id = e.id;
  const btn_id_dic = get_btn_id_dic(button_id);
  const click_btn = document.getElementById(button_id);
  const click_btnText = click_btn.textContent;
  const edit_btn = document.getElementById(btn_id_dic.target + '_EditTrigerBtn_' + btn_id_dic.pk_num);
  const edit_btnText = edit_btn.textContent;
  const accordion_Form_Box = document.getElementById(btn_id_dic.target + '_Accordion_Form_Box_' + btn_id_dic.pk_num);
  const area = document.getElementById(btn_id_dic.target + '_Textare_' + btn_id_dic.pk_num);
  const original_data = document.getElementById(btn_id_dic.target + '_Original_Text_' + btn_id_dic.pk_num);
  const setting_dic = {
    'click_btn': click_btn,                   // クリックしたボタン自身
    'click_btnText': click_btnText,           // クリックしたボタンの判定用
    'edit_btn': edit_btn,                     // 編集ボタン
    'edit_btnText': edit_btnText,             // 編集ボタンの現在の表示テキスト
    'accordion_Form_Box': accordion_Form_Box, // 開閉する accordion_Form_Box
    'area': area,                             // inputできるtextareを取得
    'original_data': original_data,           // 編集対象のコメントテキストを取得 innerHTML(<br>も含めて取得)
    // 'btn': btn,                               // クリックしたボタン自身
    // 'btnText': btnText,                       // クリックした時のボタンの表示テキスト
    // 'accordion_Form_Box': accordion_Form_Box, // 開閉する accordion_Form_Box
    // 'area': area,                             // inputできるtextareを取得
    // 'original_data': original_data,           // 編集対象のコメントテキストを取得 innerHTML(<br>も含めて取得)
  };
  return setting_dic
};


// 3. アコーディオンの動き ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
/*
    ボタンの修正後のテキストの表示切替
    入力フォームの表示切替
    編集対象のコメントテキストの表示切替
*/


// コメント・返信の'編集', '閉じる', 'キャンセル'ボタンを押した時の動き
const moveAccordionFormBox = (set_dic) => {
  const change = {
    // [ボタンの修正後のテキストの表示切替, 入力フォームの表示切替, 編集対象のコメントテキストの表示切替]
    '編集': ['閉じる', 'block', 'none'],
    '閉じる': ['編集', 'none', 'block'],
    'キャンセル': ['編集', 'none', 'block'],
  };
  const move_array = change[set_dic.edit_btnText];

  set_dic.edit_btn.textContent = move_array[0];             // ボタンのテキストを変える
  set_dic.accordion_Form_Box.style.display = move_array[1]; // 入力フォームの表示切替
  set_dic.original_data.style.display = move_array[2];      // 編集対象のコメントテキストの表示切替
};


//   4. inputできるtextareの動き ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
//    編集対象のコメントテキストをinputできるtextareにコピペして編集しやすくする

const editTextarea = (set_dic) => {
  // // 正規表現で全ての<br>を置換
  console.log(set_dic);
  // console.log('***', set_dic.Original_Text.id);
  const update_text = set_dic.original_data.innerHTML.replace(/<br>/g, '\n')
  set_dic.area.value = update_text
};


/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    「キャンセルボタン」を押した後の動き 編集分         ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/
const CancelBtn = (e) => {
  const set_dic = setting(e);
  moveAccordionFormBox(set_dic);
};


/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    「キャンセルボタン」を押した後の動き  新規分        ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/
// const clearText {
const clearText = (e) => {
  const input_comment = document.getElementById('id_comment_text');
  input_comment.value = ''
};

/*
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
    3秒後に消えるbootstrap toast Message                ＊
＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/
function dispMsg(){
  let alert = document.getElementById('alert');
  alert.style.display ="none";
}

// id='alert'があったら、
if (document.getElementById('alert') != null) {
  // console.log('alertあります');
  window.setTimeout(dispMsg, 3000);
}