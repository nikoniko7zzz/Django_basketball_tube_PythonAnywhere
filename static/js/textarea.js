/*
  内容
    - 改行で自動で大きさが変わるtextarea(全てのtextarea)
    - ボタンの内容のテキストをtextareaのカーソル位置に挿入(comment.html(入力補完用))
    - 「編集ボタン」を押した後の動き(コメント・返信 共通)
    - 「キャンセルボタン」を押した後の動き
*/

console.log("Hello textarea.js");

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

      ID名とOnclick名 説明 -> ID_and_Onclick_name.jsへ移動
        (CommentとReplyの各パーツのIDとOnclickネーム)
  1. クリックボタンのidから、comment or replyを判断し、各アイテムを取得し辞書でかえす
  2. アコーディオンの動き
        ボタンの修正後のテキストの表示切替
        入力フォームの表示切替
        編集対象のコメントテキストの表示切替
  3. inputできるtextareの動き
        編集対象のコメントテキストをinputできるtextareにコピペして編集しやすくする
        改行で自動で大きさが変わるtextarea(ファイル上部で作成済み分)

＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
*/

// 編集ボタンを押した後の動き
const EditTrigerBtn = (e) => {
  const set_dic = setting(e);      // 1
  moveAccordionFormBox(set_dic)    // 2
  editTextarea(set_dic)            // 3
  resizeTextarea(set_dic.area)     // 3
};


// 2. クリックボタンのidから、comment or replyを判断し、各アイテムIDを取得し辞書でかえす *
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

