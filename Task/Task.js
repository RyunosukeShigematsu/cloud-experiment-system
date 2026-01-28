/* Task.js */

// ==========================================
// 設定: デザイン関連
// ==========================================
const BASE_FONT_SIZE = 80; // 基準サイズ
const SCALE_FACTOR = 2.0;  // 強調倍率

// ==========================================
// ランダム決定ロジック (ページ読み込み時に決定)
// ==========================================
// 1. 情報タイプをランダムに決定 ('clock' or 'number')
const infoTypes = ['clock', 'number'];
const currentInfoType = infoTypes[Math.floor(Math.random() * infoTypes.length)];

// 2. 強調モードをランダムに決定 (0, 1, 2)
const currentEmphasis = Math.floor(Math.random() * 3);

// ★重要: Test画面でも使うため、決定したタイプを保存しておく
sessionStorage.setItem('task_info_type', currentInfoType);

// ログで確認
console.log(`今回の設定 -> Type: ${currentInfoType}, Emphasis: ${currentEmphasis}`);

// ==========================================
// 要素の取得
// ==========================================
const showBtn = document.getElementById('showBtn');
const timeContainer = document.getElementById('timeContainer');
const hourText = document.getElementById('hourText');
const minuteText = document.getElementById('minuteText');
const colonText = document.querySelector('.colon');
const blackBox = document.querySelector('.black-box');
const instructionText = document.querySelector('.instruction-text');

// ページ読み込み時の初期設定 (説明文の切り替え)
window.addEventListener('DOMContentLoaded', () => {
    if (currentInfoType === 'number') {
        instructionText.innerText = "数字が表示されます";
    } else {
        instructionText.innerText = "時刻が表示されます";
    }
});

// 0埋め関数
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// 重複なしランダム生成クラス
class RandomBag {
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.items = [];
    }
    fill() {
        this.items = [];
        for (let i = this.min; i <= this.max; i++) {
            this.items.push(i);
        }
        for (let i = this.items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
        }
    }
    next() {
        if (this.items.length === 0) this.fill();
        return this.items.pop();
    }
}

// バッグの用意
const hourBag = new RandomBag(0, 23);
const minuteBag = new RandomBag(0, 59);
const numBagLeft = new RandomBag(0, 99);
const numBagRight = new RandomBag(0, 99);


// ボタンクリック時の動作
showBtn.addEventListener('click', () => {
    
    // 1. 値の決定とコロンの表示切り替え
    let leftVal, rightVal;

    if (currentInfoType === 'clock') {
        // --- 時計モード ---
        leftVal = hourBag.next();
        rightVal = minuteBag.next();
        colonText.style.visibility = 'visible'; // 表示
        
    } else {
        // --- 数字モード ---
        leftVal = numBagLeft.next();
        rightVal = numBagRight.next();
        colonText.style.visibility = 'hidden';  // 非表示(スペース維持)
    }

    // 値をセット
    hourText.innerText = padZero(leftVal);
    minuteText.innerText = padZero(rightVal);


    // 2. サイズ計算 (ランダムで決まった currentEmphasis を使用)
    let leftSize = BASE_FONT_SIZE;
    let rightSize = BASE_FONT_SIZE;

    if (currentEmphasis === 1) {
        leftSize = BASE_FONT_SIZE * SCALE_FACTOR;  // 左強調
        rightSize = BASE_FONT_SIZE;
    } else if (currentEmphasis === 2) {
        leftSize = BASE_FONT_SIZE;
        rightSize = BASE_FONT_SIZE * SCALE_FACTOR; // 右強調
    }
    // 0の場合はそのまま

    let colonSize = Math.min(leftSize, rightSize);

    // 3. サイズ適用
    hourText.style.fontSize = `${leftSize}px`;
    minuteText.style.fontSize = `${rightSize}px`;
    colonText.style.fontSize = `${colonSize}px`;


    // 4. 表示 ＆ 自動調整
    timeContainer.classList.remove('hidden');

    const containerWidth = blackBox.clientWidth - 40; 
    const contentWidth = timeContainer.offsetWidth;

    if (contentWidth > containerWidth) {
        const ratio = containerWidth / contentWidth;
        
        hourText.style.fontSize = `${leftSize * ratio}px`;
        minuteText.style.fontSize = `${rightSize * ratio}px`;
        colonText.style.fontSize = `${colonSize * ratio}px`;
    }

    // ボタン無効化と画面遷移
    showBtn.disabled = true;
    setTimeout(() => {
        window.location.href = '../Bar/Bar.html';
    }, 1000);
});


// ボタンクリック時の動作
showBtn.addEventListener('click', () => {
    
    // 1. 値の決定（ここまでは同じ）
    let leftVal, rightVal;

    if (currentInfoType === 'clock') {
        leftVal = hourBag.next();
        rightVal = minuteBag.next();
        colonText.style.visibility = 'visible';
    } else {
        leftVal = numBagLeft.next();
        rightVal = numBagRight.next();
        colonText.style.visibility = 'hidden';
    }

    // --- 【重要変更】提示刺激を4つの数字に分解して保存 ---
    // 例: leftVal=12 -> digit1=1, digit2=2
    const digit1 = Math.floor(leftVal / 10);
    const digit2 = leftVal % 10;
    
    // 例: rightVal=5 -> digit3=0, digit4=5 (0埋め考慮)
    const digit3 = Math.floor(rightVal / 10);
    const digit4 = rightVal % 10;

    // sessionStrageに個別に保存
    sessionStorage.setItem('shown_digit_1', digit1);
    sessionStorage.setItem('shown_digit_2', digit2);
    sessionStorage.setItem('shown_digit_3', digit3);
    sessionStorage.setItem('shown_digit_4', digit4);


    // --- 【重要変更】強調条件を文字列("normal", "left", "right")に変換して保存 ---
    let emphasisString = "normal";
    if (currentEmphasis === 1) emphasisString = "left";
    if (currentEmphasis === 2) emphasisString = "right";
    
    sessionStorage.setItem('condition_emphasis', emphasisString);
    // -----------------------------------------------------------------

    // 画面表示用に0埋め文字列を作る
    hourText.innerText = padZero(leftVal);
    minuteText.innerText = padZero(rightVal);


    // 2. サイズ計算ロジック（そのまま使用）
    let leftSize = BASE_FONT_SIZE;
    let rightSize = BASE_FONT_SIZE;

    if (currentEmphasis === 1) { // 内部計算は数値(0,1,2)のままでOK
        leftSize = BASE_FONT_SIZE * SCALE_FACTOR;
        rightSize = BASE_FONT_SIZE;
    } else if (currentEmphasis === 2) {
        leftSize = BASE_FONT_SIZE;
        rightSize = BASE_FONT_SIZE * SCALE_FACTOR;
    }
    
    // ...（以下のサイズ適用・自動調整・画面遷移コードはそのまま）...
    
    let colonSize = Math.min(leftSize, rightSize);
    hourText.style.fontSize = `${leftSize}px`;
    minuteText.style.fontSize = `${rightSize}px`;
    colonText.style.fontSize = `${colonSize}px`;

    timeContainer.classList.remove('hidden');

    const containerWidth = blackBox.clientWidth - 40; 
    const contentWidth = timeContainer.offsetWidth;

    if (contentWidth > containerWidth) {
        const ratio = containerWidth / contentWidth;
        hourText.style.fontSize = `${leftSize * ratio}px`;
        minuteText.style.fontSize = `${rightSize * ratio}px`;
        colonText.style.fontSize = `${colonSize * ratio}px`;
    }

    showBtn.disabled = true;
    setTimeout(() => {
        window.location.href = '../Bar/Bar.html';
    }, 1000);
});