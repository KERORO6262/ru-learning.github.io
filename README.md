# ru-learning

Interactive Russian learning mini-site: Cyrillic alphabet now, expanding to vocabulary, phrases, and quizzes.  
支援點按發音（瀏覽器 SpeechSynthesis TTS），可調語速與音高，適合用來快速熟悉俄語字母並逐步擴充練習內容。

## 內容概覽
目前提供俄語 33 個西里爾字母（大寫＋小寫）網格，點按即可播放「字母名稱讀法」。  
後續將擴展成單字、短語、練習題與錯題本等模式，維持輕量、可分享、可擴展的純前端架構。

## 功能
- 俄語 33 字母按順序呈現（大寫＋小寫）
- 點按字母播放「字母名稱讀法」（SpeechSynthesis）
- 語音選擇（優先 ru-RU）
- 語速、音高調整
- 一鍵停止播放佇列
- 測試播放：`Привет`

## 快速開始
### 直接使用（免外部執行）
此專案採用傳統 script 分檔（非 ES Modules），你可以直接用瀏覽器開啟 `index.html` 使用。

- 桌機：雙擊 `index.html` 或拖曳到瀏覽器
- 手機：若手機不方便開本機檔案，建議用 GitHub Pages 開啟

## 專案結構

ru-learning/
index.html
css/
base.css
components.css
js/
data/
letters.js
core/
tts.js
ui/
ui.js
main.js


## 設計原則
- 資料層（data）：維護字母、單字、短語等資料來源
- 核心層（core）：封裝 TTS 的語音載入、播放、停止
- UI 層（ui）：負責 DOM 渲染與互動行為
- 入口（main）：初始化與事件掛載

為了讓 `index.html` 可直接開啟，JS 以單一命名空間 `window.RuLettersApp` 組織，避免全域變數失控。

## 瀏覽器與語音注意事項
- TTS 語音由作業系統提供。若找不到 ru-RU 語音，請到系統語音設定下載俄語語音。
- Android 通常建議使用 Chrome。iOS 建議使用 Safari 或 Chrome。
- 若點按沒有聲音，先按「重新載入語音」，再按「測試：Привет」。

## Roadmap（規劃中）
- [ ] 字母測驗：聽音選字母，計分與錯題本
- [ ] 單字模式：主題詞庫、例詞、重點發音提示
- [ ] 短語模式：常用口語短句，支援分段播放
- [ ] 音檔模式：支援 mp3 自錄發音（無 TTS 也能用）
- [ ] 手寫體模式：印刷體與手寫體對照練習

## 開發備註（給自己或協作者）
- 字母資料放在 `js/data/letters.js`，未來可新增 `vocab.js`、`phrases.js`
- TTS 邏輯集中在 `js/core/tts.js`，避免播放策略散落在各處
- UI 維持單向渲染，事件集中掛在 `js/ui/ui.js`，減少耦合
- 新增模式建議新增檔案，例如 `js/ui/quiz.js`，並在 `js/main.js` 進行掛載

## License
採用 MIT License

