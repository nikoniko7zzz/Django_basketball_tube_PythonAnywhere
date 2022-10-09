// console.log('hello')

// エンターキーの無効化 エンターキーでformを送信するのを防ぐ
document.onkeypress = function(e) {
  // エンターキーだったら無効にする
  if (e.key === 'Enter') {
    return false;
  }
}

// キャンセルボタンを押した時、inputの中身を空白にする
function clearText() {
	var textForm = document.getElementById("id_comment_text");
  textForm.value = '';
}