/* Questionnaire/Questionnaire.js */

// 要素取得
const q1Text = document.getElementById('q1_text');
const q2Text = document.getElementById('q2_text');
const followUpDiv = document.getElementById('followUpQuestions');
const nextBtn = document.getElementById('nextBtn'); // 送信ボタン
const form = document.getElementById('questForm');

// ==========================================
// 初期化処理
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // 戻るボタン無効化
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));

    // 文言の切り替え
    const infoType = sessionStorage.getItem('task_info_type');
    if (infoType === 'number') {
        q1Text.innerText = "Q1. 表示された数字を見ましたか？";
        q2Text.innerText = "Q2. 数字の大きさの一部に違いがありましたか？";
    } else {
        q1Text.innerText = "Q1. 表示された時刻を見ましたか？";
        q2Text.innerText = "Q2. 時刻の大きさの一部に違いがありましたか？";
    }

    form.addEventListener('change', checkValidity);
});

// ==========================================
// Q1の分岐
// ==========================================
const q1Radios = document.getElementsByName('q1');
q1Radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'yes') {
            followUpDiv.classList.remove('hidden');
        } else {
            followUpDiv.classList.add('hidden');
            resetRadio('q2');
            resetRadio('q3');
        }
        checkValidity();
    });
});

function resetRadio(name) {
    document.getElementsByName(name).forEach(r => r.checked = false);
}

// ==========================================
// バリデーション
// ==========================================
function checkValidity() {
    const q1Val = getRadioValue('q1');
    if (!q1Val) { nextBtn.disabled = true; return; }
    
    // NoならOK
    if (q1Val === 'no') { nextBtn.disabled = false; return; }
    
    // YesならQ2, Q3も必須
    if (!getRadioValue('q2') || !getRadioValue('q3')) {
        nextBtn.disabled = true;
        return;
    }
    nextBtn.disabled = false;
}

function getRadioValue(name) {
    for (const r of document.getElementsByName(name)) {
        if (r.checked) return r.value;
    }
    return null;
}

// ==========================================
// ★重要: データ送信処理 (ここでPHPを叩きます)
// ==========================================
nextBtn.addEventListener('click', async () => {
    
    // 1. ボタンを無効化（連打防止）
    nextBtn.disabled = true;
    nextBtn.innerText = "送信中...";

    // 2. アンケート回答を取得
    const q1 = getRadioValue('q1');
    const q2 = (q1 === 'yes') ? getRadioValue('q2') : null;
    const q3 = (q1 === 'yes') ? getRadioValue('q3') : null;

    // 3. Test画面で作った箱(sessionStorage)を取り出す
    const rawData = sessionStorage.getItem('final_experiment_data');
    let finalData = {};
    if (rawData) {
        finalData = JSON.parse(rawData);
    }

    // 4. 箱にアンケート結果を入れる
    finalData.quest_seen = q1;
    finalData.quest_noticed = q2;
    finalData.quest_memo = q3;

    // 5. サーバーへ送信！
    try {
        // ※PHPのパスはフォルダ構成に合わせてください (例: ../API/submit.php)
        const response = await fetch('https://shigematsu.nkmr.io/m1_cloud/database.php', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });

        if (response.ok) {
            // 送信成功！
            // 最新データを保存し直す（Finish画面のログ用）
            sessionStorage.setItem('final_experiment_data', JSON.stringify(finalData));
            
            // Finish画面へ移動
            window.location.replace('../Finish/Finish.html');
        } else {
            throw new Error('送信エラー');
        }

    } catch (error) {
        alert("データの送信に失敗しました。通信環境を確認してもう一度お試しください。");
        console.error(error);
        nextBtn.disabled = false;
        nextBtn.innerText = "結果を送信して終了";
    }
});