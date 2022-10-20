// 内容
// - 改行で自動で大きさが変わるtextarea
// - comment.html commentに紐ずく動画がないときはリンクボタンを非表示にする

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
function resizeReplyTextarea(ele){
  //- 改行に合わせてテキストエリアのサイズ変更
  var id_value = ele.id; // eleのプロパティとしてidを取得
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
  for(var i=0; i<link.length;i++){
    // console.log(link[i].innerHTML);
    if (link[i].innerHTML=='None'){
      // console.log('非表示にします');
      linkBox[i].style.display ="none";
    }
  }
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
