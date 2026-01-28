// ================================
// 設定：待ち時間（秒）
// ここを変えるだけで時間を変更できます
const DURATION_SECONDS = 10; 
// ================================

const progressBar = document.getElementById('progressBar');
const timeText = document.getElementById('timeText');

// ページが読み込まれたら開始
window.onload = () => {
    startProgressBar(DURATION_SECONDS);
};

function startProgressBar(seconds) {
    // CSSのtransitionを使って、指定した秒数かけて幅を100%にする
    progressBar.style.transition = `width ${seconds}s linear`;
    
    // 少しだけ遅らせてから幅を100%にする（描画のタイミングズレ防止）
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    // カウントアップの表示用（見た目だけ）
    let remainingTime = seconds;
    const interval = setInterval(() => {
        remainingTime--;
        
// 残り時間が0になったら終了
        if (remainingTime < 0) {
            clearInterval(interval);
            timeText.innerText = "完了！";
            
            // 【変更】TestフォルダのTest.htmlへ移動
            window.location.href = '../Test/Test.html';
        } else {
            timeText.innerText = `残り ${remainingTime} 秒`;
        }
    }, 1000); // 1秒ごとに実行
}