/* Test/Test.js */

// 要素の取得
const selects = document.querySelectorAll('.digit-select');
const finishBtn = document.getElementById('finishBtn'); // 画面上の完了ボタン
const colonSpan = document.querySelector('.colon'); 

// ポップアップ関連
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn'); // ポップアップ内の確定ボタン

// ==========================================
// 1. 時間計測用の変数
// ==========================================
let startTime = 0;              // ページが開いた時刻
let decisionTimes = [null, null, null, null]; // 各桁の決定時刻 (ms)
let finishLogs = [];            // 完了ボタンを押した時刻のリスト (配列で保存)

// ==========================================
// 初期化処理
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // 時間計測スタート
    startTime = Date.now();

    // Task画面の設定(コロンの有無)を引き継ぐ
    const infoType = sessionStorage.getItem('task_info_type');
    if (infoType === 'number') {
        if (colonSpan) colonSpan.style.visibility = 'hidden';
    } else {
        if (colonSpan) colonSpan.style.visibility = 'visible';
    }
});

// ==========================================
// 入力操作の監視 & 時間記録
// ==========================================
selects.forEach((select, index) => {
    select.addEventListener('change', () => {
        // ★ checkAllSelected() の呼び出しを削除しました
        // これにより、未入力があってもボタンが無効化されません

        // 2. 時間記録 (現在時刻 - スタート時刻)
        const timeElapsed = Date.now() - startTime;
        
        if (select.value === "") {
            decisionTimes[index] = null; 
        } else {
            decisionTimes[index] = timeElapsed;
        }

        console.log(`桁${index + 1} 変更: ${timeElapsed}ms`);
    });
});

// ★ checkAllSelected 関数定義自体も削除しました

// ==========================================
// 【重要】最初の「完了」ボタン (仮決定)
// ==========================================
finishBtn.addEventListener('click', () => {
    // ★ここで時間を記録しています（ポップアップが出る前）
    const timeElapsed = Date.now() - startTime;
    
    // 配列に時間を追加 (例: [1250, 4000])
    finishLogs.push(timeElapsed);
    
    console.log("完了ボタン押下ログ:", finishLogs);
    
    // ポップアップ表示
    modal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// ==========================================
// ポップアップ内の「完了する」ボタン (データ確定)
// ==========================================
confirmBtn.addEventListener('click', () => {
    
    // ユーザーの回答を取得
    const answer1 = document.getElementById('digit1').value;
    const answer2 = document.getElementById('digit2').value;
    const answer3 = document.getElementById('digit3').value;
    const answer4 = document.getElementById('digit4').value;

    // 正解データを取得
    const shown1 = sessionStorage.getItem('shown_digit_1');
    const shown2 = sessionStorage.getItem('shown_digit_2');
    const shown3 = sessionStorage.getItem('shown_digit_3');
    const shown4 = sessionStorage.getItem('shown_digit_4');

    // 正誤判定
    const isCorrectLeft = (answer1 == shown1 && answer2 == shown2) ? 1 : 0;
    const isCorrectRight = (answer3 == shown3 && answer4 == shown4) ? 1 : 0;

    // --- 【追加】空文字ならnullにする変換関数 ---
    const toNull = (val) => {
        return val === "" ? null : val;
    };
    // データをまとめる
    const experimentData = {
        // 基本情報
        user_id: sessionStorage.getItem('experiment_id'),
        gender: sessionStorage.getItem('user_gender'),
        age: sessionStorage.getItem('user_age'),
        home_dummy_answer: sessionStorage.getItem('home_dummy_answer'),

        // Check回答
        check_shape_choice: sessionStorage.getItem('check_shape_choice'),

        // 条件
        condition_type: sessionStorage.getItem('task_info_type'),
        condition_emphasis: sessionStorage.getItem('condition_emphasis'),

        // 提示刺激
        shown_digit_1: shown1,
        shown_digit_2: shown2,
        shown_digit_3: shown3,
        shown_digit_4: shown4,

        // 回答
        answer_digit_1: toNull(answer1), // ← ここを変更
        answer_digit_2: toNull(answer2), // ← ここを変更
        answer_digit_3: toNull(answer3), // ← ここを変更
        answer_digit_4: toNull(answer4), // ← ここを変更

        // 正誤
        is_correct_left: isCorrectLeft,
        is_correct_right: isCorrectRight,

        // 反応時間
        time_decide_1: decisionTimes[0],
        time_decide_2: decisionTimes[1],
        time_decide_3: decisionTimes[2],
        time_decide_4: decisionTimes[3],

        // --- 【変更】完了ログ (配列のまま保存) ---
        time_finish_logs: finishLogs 
    };

    // 保存
    sessionStorage.setItem('final_experiment_data', JSON.stringify(experimentData));

    // Finish画面へ
    window.location.href = '../Finish/Finish.html';
});