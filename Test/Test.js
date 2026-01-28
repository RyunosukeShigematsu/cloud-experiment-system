// 要素の取得
const selects = document.querySelectorAll('.digit-select');
const finishBtn = document.getElementById('finishBtn');

// ポップアップ関連の要素
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// 入力チェック関数
function checkAllSelected() {
    const allSelected = Array.from(selects).every(select => select.value !== "");

    if (allSelected) {
        finishBtn.disabled = false;
    } else {
        finishBtn.disabled = true;
    }
}

selects.forEach(select => {
    select.addEventListener('change', checkAllSelected);
});

// --- ここから変更 ---

// 1. 「完了」ボタンを押したら -> ポップアップを表示
finishBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

// 2. 「回答に戻る」ボタンを押したら -> ポップアップを隠す
cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// 3. 「完了する」ボタンを押したら -> 本当に次の画面へ
confirmBtn.addEventListener('click', () => {
    // 入力された時間を取得（ログ用）
    const time = `${selects[0].value}${selects[1].value}:${selects[2].value}${selects[3].value}`;
    console.log("最終回答:", time);
    
    // Finishページへ遷移
    window.location.href = '../Finish/Finish.html';
});