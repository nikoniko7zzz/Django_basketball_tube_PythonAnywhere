// 内容
// - 改行で自動で大きさが変わるtextarea
// - comment.html commentに紐ずく動画がないときはリンクボタンを非表示にする
// - comment.html ボタンの内容のテキストをtextareaのカーソル位置に挿入
// - item_detail.html 修正ボタンidのcomment_textをtextareaに挿入し編集できるようにする

console.log("Hello Start");

// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 改行で自動で大きさが変わるtextarea ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

window.addEventListener('load', function() {

  //- 改行に合わせてテキストエリアのサイズ変更
  this.resizeItemTextarea = () => {

    // textarea要素のpaddingのY軸(高さ)
    const PADDING_Y = 20;

    // textarea要素
    const $textarea = document.getElementById("id_description");

    // textarea要素のlineheight
    let lineHeight = getComputedStyle($textarea).lineHeight;
    // "19.6px" のようなピクセル値が返ってくるので、数字だけにする
    lineHeight = lineHeight.replace(/[^-\d\.]/g, '');

    // textarea要素に入力された値の行数
    const lines = ($textarea.value + '\n').match(/\n/g).length;

    // 高さを再計算
    $textarea.style.height = lineHeight * lines + PADDING_Y + 'px';
  };
})


window.addEventListener('load', function() {
  //- 改行に合わせてテキストエリアのサイズ変更
  this.resizeCommentTextarea = () => {
    const PADDING_Y = 20;
    const $textarea = document.getElementById("id_comment_text");
    let lineHeight = getComputedStyle($textarea).lineHeight;
    lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
    const lines = ($textarea.value + '\n').match(/\n/g).length;
    $textarea.style.height = lineHeight * lines + PADDING_Y + 'px';
  };
})

// Replyは一つのテンプレートに複数あるので、idを取得して、getElementByIdする
// コメント修正と返信修正も同じjs
function resizeTextarea(ele){
  //- 改行に合わせてテキストエリアのサイズ変更
  var id_value = ele.id; // eleのプロパティとしてidを取得 id="reply_text_{{ comment.pk }}"
  const PADDING_Y = 20;
  const $textarea = document.getElementById(id_value);
  let lineHeight = getComputedStyle($textarea).lineHeight;
  lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
  const lines = ($textarea.value + '\n').match(/\n/g).length;
  $textarea.style.height = lineHeight * lines + PADDING_Y + 'px';
}




// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// comment.html commentに紐ずく動画がないときはリンクボタンを非表示にする ＊＊＊＊＊＊＊＊＊
window.onload = function onLoad() {
  var link = document.querySelectorAll("#comment_to_detail_link");
  var linkBox = document.querySelectorAll("#comment_to_detail_link_box");
  // console.log(linkBox.length);
  // console.log(link.length);
  for(var i=0; i<link.length;i++){
    if (link[i].innerHTML=='None'){
      console.log(link[i].innerHTML);
      console.log('非表示にします');
      linkBox[i].style.display ="none";
    }
  }
}

// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// comment.html ボタンの内容のテキストをtextareaのカーソル位置に挿入 ＊＊＊＊＊＊＊＊＊＊＊＊
function addText(e){
	//テキストエリアと挿入する文字列を取得
	var area = document.getElementById('id_comment_text');
  // var btn_value = btn.id; // eleのプロパティとしてidを取得
	var text = e.value;
	//カーソルの位置を基準に前後を分割して、その間に文字列を挿入
	area.value = area.value.substr(0, area.selectionStart)
			+ text
			+ area.value.substr(area.selectionStart);
}

// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// item_detail.html 「コメント修正ボタン」idのcomment_textをtextareaに挿入し編集できるようにする ＊＊＊＊＊
function updateCommentText(e){
  // 修正ボタンのidを取得
	var id = e.id; // id="collapse_update_Trigger_{{ comment.pk }}
  var id = id.replace('collapse_update_Trigger_', '');
  console.log(id);
	//テキストエリアを取得
	var area = document.getElementById('id_comment_text_' + id);
  // 修正したいコメントを取得 innerHTML(<br>も含めて取得)
  var update_target = document.getElementById('get_comment_text_' + id)
  // 正規表現で全ての<br>を置換
  var update_text = update_target.innerHTML.replace(/<br>/g, '\n')
  area.value = update_text

  //- 改行に合わせてテキストエリアのサイズ変更
  const PADDING_Y = 20;
  let lineHeight = getComputedStyle(area).lineHeight;
  lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
  const lines = (area.value + '\n').match(/\n/g).length;
  area.style.height = lineHeight * lines + PADDING_Y + 'px';

  // 修正したいコメント非表示
  update_target.style.display ="none";
}

// item_detail.html 「返信修正ボタン」idのcomment_textをtextareaに挿入し編集できるようにする ＊＊＊＊＊
function updateReplyText(e){
  // 修正ボタンのidを取得
	var id = e.id; // id="collapse_reply_update_Trigger_{{ comment.pk }}
  var id = id.replace('collapse_reply_update_Trigger_', '');
  console.log(id);
	//テキストエリアを取得
	var area = document.getElementById('id_reply_text_' + id);
  // 修正したいコメントを取得 innerHTML(<br>も含めて取得)
  var update_target = document.getElementById('get_reply_text_' + id)
  // 正規表現で全ての<br>を置換
  var update_text = update_target.innerHTML.replace(/<br>/g, '\n')
  area.value = update_text

  //- 改行に合わせてテキストエリアのサイズ変更
  const PADDING_Y = 20;
  let lineHeight = getComputedStyle(area).lineHeight;
  lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
  const lines = (area.value + '\n').match(/\n/g).length;
  area.style.height = lineHeight * lines + PADDING_Y + 'px';

  // 修正したいコメント非表示
  update_target.style.display ="none";
}


// item_detail.html 編集送信ボタンを押したら、非表示にしたコメントを表示する ＊＊＊＊＊
function showComment_text(e){
	var id = e.id; // id="update_{{ object.pk }}"
  var id = id.replace('submit_', '');
  // 修正したいコメントを取得 innerHTML(<br>も含めて取得)
  var update_target = document.getElementById('get_comment_text_' + id)
  update_target.style.display ="block";
}


console.log("Hello End");


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// item_detail.html コメントの返信ボタンを押したら、返信フォームを表示する ＊＊＊＊＊＊＊＊＊

// // 押したボタンのid名取得
// const hoge = (e) =>{
//   console.log(e.target.id);
// }

// btn.addEventListener('click', hoge, false)




// function getId(ele){
//     var id_value = ele.id; // eleのプロパティとしてidを取得
//     console.log(id_value); //「id01」
// }

// function clickDisplayAlert() {
//   alert("ボタンがクリックされました！");
// }

// function getId(clicked_id) {
//   alert(clicked_id);
//   console.log(clicked_id);
//   var insertBox = 'replyBox_' + clicked_id;
//   const element = document.querySelector(insertBox);
//   element.insertAdjacentHTML('beforeend', '<div>追加テキスト</div>');
// }

// ボタンを押したら、bootstrapのトーストが表示されて、
// 返信フォームが入っているので、viewを動かす



// エンターキーの無効化 エンターキーでformを送信するのを防ぐ
// document.onkeypress = function(e) {
//   // エンターキーだったら無効にする
//   if (e.key === 'Enter') {
//     return false;
//   }
// }
