// 内容
// - 改行で自動で大きさが変わるtextarea(全てのtextarea)
// - commentに紐ずく動画がないときはリンクボタンを非表示にする(comment.html, everyone_comment.html )
// - ボタンの内容のテキストをtextareaのカーソル位置に挿入(comment.html(入力補完用))
// - 「編集ボタン」を押した後の動き(コメント・返信 共通)
// - 「キャンセルボタン」を押した後の動き
// - 3秒後に消えるbootstrap toast Message(ログインしましたなどのメッセージ)


console.log("Hello Start");


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 改行で自動で大きさが変わるtextarea                      ＊
// 全てのtextarea                                          ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
const resizeTextarea = (e) => {
  const textarea_id = e.id
  console.log(textarea_id);
  // textarea要素
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


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// commentに紐ずく動画がないときはリンクボタンを非表示にする ＊
// comment.html, everyone_comment.html                       ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

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


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// ボタンの内容のテキストをtextareaのカーソル位置に挿入      ＊
// comment.html(入力補完用)                                  ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
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



// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 編集キャンセルボタンを押したら、入力できるtextareaの中身を消して非表示にし、  ＊
// 非表示にしたコメントを表示する item_detail.html                               ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// function endEdit(e){
//   // 修正ボタンのidを取得
// 	var id = e.id; // id="endEdit_comment_{{ comment.pk }}"
//   console.log('編集キャンセルボタンを押しました');
//   // idに指定の文字が含まれているかの判定
//   // idから返信先のpkだけを取り出す
//   if (id.includes('endEdit_comment_')) {
//     var id = id.replace('endEdit_comment_', '');
//   // } else if (id.includes('collapse_reply_update_Trigger_')){
//   //   var id = id.replace('collapse_reply_update_Trigger_', '');
//   }
//   // 修正前のコメントを取得 innerHTML(<br>も含めて取得)
//   var original_data = document.getElementById('get_comment_text_' + id)
//   // // 正規表現で全ての<br>を置換
//   // var update_text = original_data.innerHTML.replace(/<br>/g, '\n')
//   // inputのテキストエリアのコメントを取得
//   var input_data = document.getElementById('id_comment_text_' + id)
//   input_data.value = ''
//   original_data.style.display ="block"; //表示
//   // 編集開閉ボタンを押させる
//   var trigger = document.getElementById('collapse_update_Trigger_' + id)
//   trigger.click();
//   // 編集入力フォーム全てを非表示にする
//   // var input_data = document.getElementById('collapse_update_' + id)
//   // input_data.style.display ="none"; //表示
// }



// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
//  〜 編集ボタンを押したら 〜
// 対応のAccordion_Boxが開閉する
// 編集 <---> 閉じる と、ボタンの表示が切り替わる
// 編集対象のコメントテキスト と inputできるtextareの動き
//
//   1. 辞書
//         (CommentとReplyの各パーツのIDとOnclickネーム)
//   2. クリックボタンのidから、comment or replyを判断し、各アイテムを取得し辞書でかえす
//   3. アコーディオンの動き
//         ボタンの修正後のテキストの表示切替
//         入力フォームの表示切替
//         編集対象のコメントテキストの表示切替
//   4. inputできるtextareの動き
//         編集対象のコメントテキストをinputできるtextareにコピペして編集しやすくする
//         改行で自動で大きさが変わるtextarea(ファイル上部で作成済み分)
//
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

// 編集ボタンを押した後の動き
const EditTrigerBtn = (e) => {
  const set_dic = setting(e)       // 1
  moveAccordionFormBox(set_dic)    // 2
  editTextarea(set_dic)            // 3
  resizeTextarea(set_dic.area)     // 4
}



// 1. 辞書 ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

// 各パーツの配列 前(comment or reply), 後(pk)をくっつけて利用する
// 例: (comment + _EditTrigerBtn_ + pk),
// 例: (reply + _EditTrigerBtn_ + pk)

// CommentとReplyの各パーツのID
const button_id_dic = {
  'EditTrigerBtn': '_EditTrigerBtn_',         // 編集ボタン　EditTriger
  'Original_Text': '_Original_Text_',         // 編集対象のコメントテキスト　'get_comment_text_',
  'Accordion_Form_Box': '_Accordion_Form_Box_',         // 開閉ゾーン formの箱　'collapse_comment_',
  'Textare': '_Textare_',               // inputできるtextare　id_comment_text_
  'CancelBtn': '_CancelBtn_',             // キャンセルボタン　endEdit_comment_{{ comment.pk }
  // 'SubmitBtn': '_SubmitBtn_',             // 編集送信ボタン　submit_
};


// // // CommentとReplyの各パーツのOnclick
// EditTrigerBtn(this);   // 編集ボタン(formの開閉)　collapseTrigger(this);
// resizeTextarea(this);  // inputできるtextare(テキストをコピペ)　resizeTextarea(this);
// CancelBtn(this);       // キャンセルボタン(formの開閉 + inputできるtextareのクリア)　endEdit('{{ comment.pk }}');
// //   '_SubmitBtn_(this);',       // 編集送信ボタン(編集対象のコメントテキスト 表示)　showComment_text(this);
// // ]


// 2. クリックボタンのidから、comment or replyを判断し、各アイテムを取得し辞書でかえす *

const setting = (e) => {
  const button_id = e.id
  const btn_id_array = button_id.split( '_' );
  // dic = {target: 'comment', btn_name: 'EditTrigerBtn', pk_num: '74'}
  const dic = {
    'target': btn_id_array[0],
    'btn_name': btn_id_array[1],
    'pk_num': btn_id_array[2],
  }
  const btn = document.getElementById(button_id)
  const btnText = btn.textContent;
  const accordion_Form_Box = document.getElementById(dic.target + button_id_dic.Accordion_Form_Box + dic.pk_num);
  const area = document.getElementById(dic.target + button_id_dic.Textare + dic.pk_num);
  const original_data = document.getElementById(dic.target + button_id_dic.Original_Text + dic.pk_num);

  const setting_dic = {
    'btn': btn,                     // クリックしたボタン自身
    'btnText': btnText,             // クリックした時のボタンの表示テキスト
    'accordion_Form_Box': accordion_Form_Box, // 開閉する accordion_Form_Box
    'area': area,                   // inputできるtextareを取得
    'original_data': original_data, // 編集対象のコメントテキストを取得 innerHTML(<br>も含めて取得)
  };
  return setting_dic
};


// 3. アコーディオンの動き ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
//         ボタンの修正後のテキストの表示切替
//         入力フォームの表示切替
//         編集対象のコメントテキストの表示切替

const moveAccordionFormBox = (set_dic) => {
  const change = {
    // [ボタンの修正後のテキストの表示切替, 入力フォームの表示切替, 編集対象のコメントテキストの表示切替]
    '編集': ['閉じる', 'block', 'none'],
    '閉じる': ['編集', 'none', 'block'],
  };
  const move_array = change[set_dic.btnText];

  set_dic.btn.textContent = move_array[0];             // ボタンのテキストを変える
  set_dic.accordion_Form_Box.style.display = move_array[1]; // 入力フォームの表示切替
  set_dic.original_data.style.display = move_array[2]; // 編集対象のコメントテキストの表示切替
};


//   4. inputできるtextareの動き ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
//         編集対象のコメントテキストをinputできるtextareにコピペして編集しやすくする

const editTextarea = (set_dic) => {
  // // 正規表現で全ての<br>を置換
  const update_text = set_dic.original_data.innerHTML.replace(/<br>/g, '\n')
  set_dic.area.value = update_text
};


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 「キャンセルボタン」を押した後の動き                    ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊





// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 3秒後に消えるbootstrap toast Message                    ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

function dispMsg(){
  let alert = document.getElementById('alert');
  alert.style.display ="none";
}

// id='alert'があったら、
if (document.getElementById('alert') != null) {
  // console.log('alertあります');
  window.setTimeout(dispMsg, 3000);
}