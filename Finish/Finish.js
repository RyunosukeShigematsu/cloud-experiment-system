const idElement = document.getElementById('generatedId');
const copyBtn = document.getElementById('copyBtn');

// 画面読み込み時に保存されたIDを取得して表示
window.onload = () => {
    // sessionStorageからIDを取り出す
    const savedId = sessionStorage.getItem('experiment_id');

    if (savedId) {
        // 保存されたIDがあれば表示
        idElement.innerText = savedId;
    } else {
        // 万が一ない場合（直接このページに来た場合など）の予備動作
        idElement.innerText = "ID_NOT_FOUND";
    }
};

// --- 以下、コピー機能などはそのまま ---

// コピーボタンの動作
copyBtn.addEventListener('click', () => {
    const textToCopy = idElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'コピー完了!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('コピー失敗', err);
    });
});