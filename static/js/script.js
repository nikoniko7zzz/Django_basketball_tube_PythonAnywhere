/*
  内容
    - commentに紐ずく動画がないときはリンクボタンを非表示にする(comment.html, everyone_comment.html )
    - 3秒後に消えるbootstrap toast Message(ログインしましたなどのメッセージ)
*/

console.log("Hello script.js");


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
