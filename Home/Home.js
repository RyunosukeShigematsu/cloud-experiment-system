// 要素の取得
const consentCheck = document.getElementById('consentCheck');
const ageSelect = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const dummyRadios = document.querySelectorAll('input[name="dummy"]');
const nextBtn = document.getElementById('nextBtn');

// チェック関数
function checkValidation() {
    // 1. 注意事項にチェックが入っているか
    const isConsentChecked = consentCheck.checked;

    // 2. 年齢が選択されているか
    const isAgeSelected = ageSelect.value !== "";

    // 3. 性別が選択されているか
    const isGenderSelected = genderSelect.value !== "";

    // 4. 【変更点】ダミー質問が「どれか一つでも選択されているか」だけチェック
    // （特定の値である必要をなくしました）
    const isDummySelected = document.querySelector('input[name="dummy"]:checked') !== null;

    // 全て選択されていればボタンを有効化
    if (isConsentChecked && isAgeSelected && isGenderSelected && isDummySelected) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// イベントリスナーの設定
consentCheck.addEventListener('change', checkValidation);
ageSelect.addEventListener('change', checkValidation);
genderSelect.addEventListener('change', checkValidation);

dummyRadios.forEach(radio => {
    radio.addEventListener('change', checkValidation);
});

// ボタンクリック時の動作
nextBtn.addEventListener('click', () => {
    // 記録用ログ（必要であれば）
    const selectedDummy = document.querySelector('input[name="dummy"]:checked');
    console.log("ダミー回答:", selectedDummy ? selectedDummy.value : "なし");

    // Task画面へ移動
    window.location.href = '../Task/Task.html';
});