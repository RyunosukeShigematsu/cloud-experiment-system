console.log("Task page loaded");

// ボタン要素を取得
const toBarBtn = document.getElementById('toBarBtn');

// ボタンが存在する場合のみイベントを設定
if (toBarBtn) {
    toBarBtn.addEventListener('click', () => {
        console.log("Barページへ移動します");
        // BarフォルダのBar.htmlへ遷移
        window.location.href = '../Bar/Bar.html';
    });
}