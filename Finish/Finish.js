const idElement = document.getElementById('generatedId');
const copyBtn = document.getElementById('copyBtn');

window.onload = () => {
    // 1. IDの表示
    const savedId = sessionStorage.getItem('experiment_id');
    if (savedId) {
        idElement.innerText = savedId;
    } else {
        idElement.innerText = "ID_NOT_FOUND";
    }

    // 2. 実験データの確認ログ出力 & データベース送信
    const finalDataJson = sessionStorage.getItem('final_experiment_data');

    if (finalDataJson) {
        const finalData = JSON.parse(finalDataJson);
        
        // --- ログ出力（ご提示いただいたコード） ---
        console.log("=== 実験データ確認 (送信内容) ===");
        const displayData = { ...finalData };
        if (Array.isArray(displayData.time_finish_logs)) {
            displayData.time_finish_logs = JSON.stringify(displayData.time_finish_logs);
        }
        console.table(displayData);
        console.log("Raw Data:", finalData);


        // --- 【追加】PHPへデータを送信する処理 ---
        
        // リロード対策：まだ保存していない場合のみ実行
        if (!sessionStorage.getItem('data_is_saved')) {
            
            // ファイル構成に基づき、一つ上の階層の database.php を指定
            fetch('../database.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: finalDataJson // そのままJSON文字列を送ればOK
            })
            .then(response => response.json()) // PHPからのレスポンスをJSONとして受け取る
            .then(data => {
                console.log('DB送信結果:', data);
                
                if (data.status === 'success') {
                    console.log('✅ データベースへの保存に成功しました。');
                    // 保存済みフラグを立てる（リロード時の再送信防止）
                    sessionStorage.setItem('data_is_saved', 'true');
                } else {
                    console.error('❌ 保存エラー:', data.message);
                }
            })
            .catch(error => {
                console.error('通信エラー:', error);
            });

        } else {
            console.log('ℹ️ このデータは既に保存済みです。');
        }

    } else {
        console.warn("実験データが見つかりません。");
    }
};

// コピーボタンの動作
copyBtn.addEventListener('click', () => {
    const textToCopy = idElement.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerText = 'コピー完了'; 
        copyBtn.classList.add('copied');
    }).catch(err => {
        console.error('コピー失敗', err);
    });
});