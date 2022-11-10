// 内容
// - 改行で自動で大きさが変わるtextarea(全てのtextarea)
// - commentに紐ずく動画がないときはリンクボタンを非表示にする(comment.html, everyone_comment.html )
// - ボタンの内容のテキストをtextareaのカーソル位置に挿入(comment.html(入力補完用))
// - 「コメント修正ボタン」idのcomment_textをtextareaに挿入し編集できるようにする(item_detail.html)
// - 3秒後に消えるbootstrap toast Message(ログインしましたなどのメッセージ)


console.log("Hello Start");


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 改行で自動で大きさが変わるtextarea                      ＊
// 全てのtextarea                                          ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
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

// window.addEventListener('load', function() {
//   //- 改行に合わせてテキストエリアのサイズ変更
//   this.resizeCommentTextarea = () => {
//     const PADDING_Y = 20;
//     const $textarea = document.getElementById("id_comment_text");
//     let lineHeight = getComputedStyle($textarea).lineHeight;
//     lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
//     const lines = ($textarea.value + '\n').match(/\n/g).length;
//     $textarea.style.height = lineHeight * lines + PADDING_Y + 'px';
//   };
// })


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// commentに紐ずく動画がないときはリンクボタンを非表示にする ＊
// comment.html, everyone_comment.html                       ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
window.onload = function onLoad() {
  var link = document.querySelectorAll("#comment_to_detail_link");
  var linkBox = document.querySelectorAll("#comment_to_detail_link_box");
  // console.log(linkBox.length);
  // console.log(link.length);
  for(var i=0; i<link.length;i++){
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
	//テキストエリアと挿入する文字列を取得
	var area = document.getElementById('id_comment_text');
  // var btn_value = btn.id; // eleのプロパティとしてidを取得
	var text = e.value;
	//カーソルの位置を基準に前後を分割して、その間に文字列を挿入
	area.value = area.value.substr(0, area.selectionStart)
			+ text
			+ area.value.substr(area.selectionStart);
}


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 「コメント修正ボタン」idの修正前のcomment_textをtextareaに挿入し  ＊
// 編集できるようにする  item_detailhtml                             ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function updateCommentText(e){

  // 修正ボタンのidを取得
	var id = e.id; // id="collapse_update_Trigger_{{ comment.pk }}
  console.log('修正します');
  // idに指定の文字が含まれているかの判定
  // idから返信先のpkだけを取り出す
  if (id.includes('collapse_update_Trigger_')) {
    // console.log('collapse_update_Trigger_文字列が含まれています。');
    var id = id.replace('collapse_update_Trigger_', '');
  } else if (id.includes('collapse_reply_update_Trigger_')){
    var id = id.replace('collapse_reply_update_Trigger_', '');
  }

	//テキストエリアを取得
	var area = document.getElementById('id_comment_text_' + id);
  // 修正前のコメントを取得 innerHTML(<br>も含めて取得)
  var original_data = document.getElementById('get_comment_text_' + id)
  // 正規表現で全ての<br>を置換
  var update_text = original_data.innerHTML.replace(/<br>/g, '\n')
  area.value = update_text

  //- 改行に合わせてテキストエリアのサイズ変更
  const PADDING_Y = 20;
  let lineHeight = getComputedStyle(area).lineHeight;
  lineHeight = lineHeight.replace(/[^-\d\.]/g, '');
  const lines = (area.value + '\n').match(/\n/g).length;
  area.style.height = lineHeight * lines + PADDING_Y + 'px';

  // 修正前のコメント非表示
  original_data.style.display ="none";
}


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 編集送信ボタンを押したら、非表示にしたコメントを表示する  ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function showComment_text(e){
	var id = e.id; // id="update_{{ object.pk }}"
  var id = id.replace('submit_', '');
  // 修正前のコメントを取得)
  var original_data = document.getElementById('get_comment_text_' + id)
  // 修正前のコメント表示
  original_data.style.display ="block";
}


// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 編集キャンセルボタンを押したら、入力できるtextareaの中身を消して非表示にし、  ＊
// 非表示にしたコメントを表示する item_detail.html                               ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function endEdit(e){
  // 修正ボタンのidを取得
	var id = e.id; // id="endEdit_comment_{{ comment.pk }}"
  console.log('編集キャンセルボタンを押しました');
  // idに指定の文字が含まれているかの判定
  // idから返信先のpkだけを取り出す
  if (id.includes('endEdit_comment_')) {
    var id = id.replace('endEdit_comment_', '');
  // } else if (id.includes('collapse_reply_update_Trigger_')){
  //   var id = id.replace('collapse_reply_update_Trigger_', '');
  }
  // 修正前のコメントを取得 innerHTML(<br>も含めて取得)
  var original_data = document.getElementById('get_comment_text_' + id)
  // // 正規表現で全ての<br>を置換
  // var update_text = original_data.innerHTML.replace(/<br>/g, '\n')
  // inputのテキストエリアのコメントを取得
  var input_data = document.getElementById('id_comment_text_' + id)
  input_data.value = ''
  original_data.style.display ="block"; //表示
  // 編集開閉ボタンを押させる
  var trigger = document.getElementById('collapse_update_Trigger_' + id)
  trigger.click();
  // 編集入力フォーム全てを非表示にする
  // var input_data = document.getElementById('collapse_update_' + id)
  // input_data.style.display ="none"; //表示
}

const elements = document.querySelectorAll('.more');

Array.from(elements).forEach(function(el){

    //ボタンを取得
    const btn = el.querySelector('.more__btn');
    //コンテンツを取得
    const content = el.querySelector('.more__content');

    //ボタンクリックでイベント発火
    btn.addEventListener('click', function(){

        if(!content.classList.contains('open')){
            //コンテンツの実際の高さを代入
            //キーワード値（none、max-content等）では動作しないので注意
            content.style.maxHeight = content.scrollHeight + 'px';
            //openクラスを追加
            content.classList.add('open');
            //もっと見るボタンのテキストを設定
            btn.textContent = '閉じる';
        } else {
            //コンテンツの高さを固定値を代入
            content.style.maxHeight = '150px';
            //openクラスを削除
            content.classList.remove('open');
            //もっと見るボタンのテキストを設定
            btn.textContent = 'もっと見る';
        }
    });
});











// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 3秒後に消えるbootstrap toast Message                    ＊
// ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// id='alert'があったら、
if (document.getElementById('alert') != null) {
  // console.log('alertあります');
  window.setTimeout(dispMsg, 3000);
}

function dispMsg(){
  let alert = document.getElementById('alert');
  alert.style.display ="none";
}