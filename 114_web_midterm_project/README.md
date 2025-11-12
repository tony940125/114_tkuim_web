# Study Buddy Matcher（114_web_midterm_project）

> 兩人一組期中專案示範：以 **JavaScript + Bootstrap 5** 建立「讀書會媒合與報名」網站，具 **RWD、互動功能、表單驗證、DOM 操作、GitHub Pages** 部署與 **localStorage**（加分）

## Demo（GitHub Pages）
部署後填入：`https://<username>.github.io/114_web_midterm_project/`

## 組員
- 組員 A（412110123-蔡東霖）
- 組員 B（412631086-陳昱丞）

## 專案簡介
- 使用者可瀏覽與搜尋讀書會、報名（RSVP）與取消報名
- 可自行建立讀書會（主題、日期、時間、地點、人數上限、分類、描述）
- 具即時表單驗證與自訂錯誤訊息（HTML5 Constraint Validation API）
- 支援 **深色模式**、**動畫**、**localStorage** 持久化

## 使用技術
- HTML5、語意化結構（`header/main/section/article/footer`）
- CSS3、Bootstrap 5、RWD
- JavaScript（ES6+）、DOM（`querySelector`、`addEventListener`、`createElement` 等）
- 表單驗證（Constraint Validation API + `setCustomValidity`）
- localStorage（加分）

## 功能特色對照（對應作業需求）
- [x] 至少兩種互動效果：**搜尋/排序**、**RSVP/取消**、**建立表單即時驗證**、**深色模式**（>2 種）
- [x] DOM 操作：以 JS 動態 **建立卡片**、事件委派、狀態同步
- [x] 表單驗證：必填/長度/範圍，自訂錯誤訊息與 `was-validated` UX
- [x] GitHub：含 `README.md`，可部署到 Pages
- [x] 加分：`localStorage`、動畫、深色模式、完整 RWD

## 檔案結構
```
midterm_project/
├─ index.html
├─ style.css
├─ script.js
├─ assets/
│  └─ logo.svg
├─ screenshots/
│  ├─ 01_home.png
│  ├─ 02_search.png
│  ├─ 03_create_form.png
│  └─ 04_darkmode.png
└─ README.md
```

## 如何在本機測試
1. 下載本專案或 `git clone`：
   ```bash
   git clone https://github.com/<username>/114_web_midterm_project.git
   cd 114_web_midterm_project
   ```
2. 直接以瀏覽器開啟 `index.html`（或使用 VS Code Live Server）。

## GitHub Pages 部署
1. 建立公開 Repository：`114_web_midterm_project`
2. 上傳所有檔案（`index.html` 必須在根目錄）
3. 到 **Settings › Pages**：
   - Source：**Deploy from a branch**
   - Branch：`main` / 根目錄（`/root`）
4. 儲存後稍等數十秒，取得公開網址
5. 將 **專案連結、Pages 網址與 4 張截圖** 上傳 iClass

## 補充說明（可延伸）
- 會員註冊/登入（localStorage 模擬）、密碼強度條
- PWA 離線瀏覽
- 將 RSVP 換成 QRCode 簽到（第三方套件）

---

© 2025 Study Buddy Matcher
