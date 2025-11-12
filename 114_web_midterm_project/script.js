const DEFAULT_SESSIONS = [
  { id: crypto.randomUUID(), title: "資料結構刷題", date: "2025-11-18", time: "18:30", place: "圖書館 3F 討論區", quota: 6, tag: "程式", desc: "LeetCode easy/medium 練習，帶筆電。" },
  { id: crypto.randomUUID(), title: "統計學期中重點複習", date: "2025-11-16", time: "14:00", place: "B402 教室", quota: 10, tag: "數學", desc: "母體 vs. 母數、抽樣分配、信賴區間。" },
  { id: crypto.randomUUID(), title: "英文演講練習", date: "2025-11-20", time: "12:10", place: "語言中心 2F", quota: 5, tag: "語言", desc: "每人 3 分鐘 Lightning Talk，互評給建議。" },
  { id: crypto.randomUUID(), title: "網頁程式設計 QA", date: "2025-11-15", time: "19:00", place: "資電館 5F 共同空間", quota: 8, tag: "程式", desc: "Bootstrap、DOM、表單驗證 Q&A。" }
];
const STORAGE_KEYS = {
  sessions: "sbm.sessions",
  rsvps: "sbm.rsvps",
  theme: "sbm.theme"
};

function loadSessions() {
  const raw = localStorage.getItem(STORAGE_KEYS.sessions);
  return raw ? JSON.parse(raw) : DEFAULT_SESSIONS;
}
function saveSessions(data) {
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(data));
}
function loadRsvps() {
  const raw = localStorage.getItem(STORAGE_KEYS.rsvps);
  return raw ? JSON.parse(raw) : {};
}
function saveRsvps(data) {
  localStorage.setItem(STORAGE_KEYS.rsvps, JSON.stringify(data));
}

const cardsWrap = document.querySelector("#cardsWrap");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const resetFilterBtn = document.querySelector("#resetFilterBtn");
const sortSelect = document.querySelector("#sortSelect");
const createForm = document.querySelector("#createForm");
const desc = document.querySelector("#desc");
const descCount = document.querySelector("#descCount");
const themeToggle = document.querySelector("#themeToggle");

let sessions = loadSessions();
let rsvps = loadRsvps();
let keyword = "";
let sortBy = "timeAsc";

function formatDate(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function toDateTimeStr(date, time) {
  return new Date(`${date}T${time}:00`);
}

function renderCards() {
  cardsWrap.innerHTML = "";
  let data = sessions.filter(s => {
    const text = (s.title + s.place + s.tag + s.desc).toLowerCase();
    return text.includes(keyword.toLowerCase());
  });
  const sorters = {
    timeAsc: (a,b) => toDateTimeStr(a.date, a.time) - toDateTimeStr(b.date, b.time),
    timeDesc: (a,b) => toDateTimeStr(b.date, b.time) - toDateTimeStr(a.date, a.time),
    titleAsc: (a,b) => a.title.localeCompare(b.title, "zh-Hant")
  };
  data.sort(sorters[sortBy]);

  if (data.length === 0) {
    emptyState.classList.remove("d-none");
    return;
  }
  emptyState.classList.add("d-none");

  data.forEach((s) => {
    const joined = rsvps[s.id]?.size || 0;
    const left = Math.max(0, s.quota - joined);
    const full = left === 0;

    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <article class="card h-100 shadow-sm border-0 card-fade">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <h3 class="h5 card-title">${s.title}</h3>
            <span class="badge text-bg-${badgeColor(s.tag)}">${s.tag}</span>
          </div>
          <ul class="list-unstyled small text-muted mb-3">
            <li>📅 ${formatDate(s.date)} ${s.time}</li>
            <li>📍 ${s.place}</li>
            <li>👥 名額 ${joined}/${s.quota}（剩 ${left}）</li>
          </ul>
          <p class="flex-grow-1 mb-3">${s.desc || ""}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm ${full ? "btn-secondary" : "btn-primary"} rsvp-btn" data-id="${s.id}" ${full ? "disabled" : ""}>${full ? "已額滿" : "我要參加"}</button>
            <button class="btn btn-sm btn-outline-danger cancel-btn" data-id="${s.id}">取消參加</button>
          </div>
        </div>
      </article>
    `;
    cardsWrap.appendChild(col);
  });
}

function badgeColor(tag) {
  switch(tag) {
    case "程式": return "primary";
    case "數學": return "success";
    case "語言": return "warning";
    case "商管": return "info";
    default: return "secondary";
  }
}

searchInput.addEventListener("input", (e) => {
  keyword = e.target.value.trim();
  renderCards();
});
sortSelect.addEventListener("change", (e) => {
  sortBy = e.target.value;
  renderCards();
});
resetFilterBtn.addEventListener("click", () => {
  keyword = "";
  searchInput.value = "";
  sortBy = "timeAsc";
  sortSelect.value = "timeAsc";
  renderCards();
});

cardsWrap.addEventListener("click", (e) => {
  const rsvpBtn = e.target.closest(".rsvp-btn");
  const cancelBtn = e.target.closest(".cancel-btn");
  if (rsvpBtn) {
    const id = rsvpBtn.dataset.id;
    rsvps[id] = rsvps[id] || new Set();
  
    const who = "me"; 
    rsvps[id].add(who);
  
    rsvps[id] = new Set([...rsvps[id]]);
    saveRsvps(serializableRsvps());
    renderCards();
  }
  if (cancelBtn) {
    const id = cancelBtn.dataset.id;
    const who = "me";
    if (rsvps[id]) {
      rsvps[id].delete?.(who);
      saveRsvps(serializableRsvps());
      renderCards();
    }
  }
});

function serializableRsvps() {
  const obj = {};
  Object.keys(rsvps).forEach(k => {
    obj[k] = Array.from(rsvps[k]);
  });
  return obj;
}
function loadRsvps() {
  const raw = localStorage.getItem(STORAGE_KEYS.rsvps);
  if (!raw) return {};
  const parsed = JSON.parse(raw);

  const obj = {};
  Object.keys(parsed).forEach(k => obj[k] = new Set(parsed[k]));
  return obj;
}

["title","date","time","place","quota"].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener("invalid", () => {
    if (el.validity.valueMissing) el.setCustomValidity("此欄位為必填。");
    else if (el.validity.rangeOverflow || el.validity.rangeUnderflow) el.setCustomValidity("請輸入有效範圍。");
    else if (el.validity.tooShort) el.setCustomValidity("字數太短。");
    else el.setCustomValidity("");
  });
  el.addEventListener("input", () => el.setCustomValidity(""));
});

desc.addEventListener("input", () => {
  descCount.textContent = `${desc.value.length} / ${desc.maxLength}`;
});

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!createForm.checkValidity()) {
    createForm.classList.add("was-validated");
    return;
  }
  const formData = new FormData(createForm);
  const item = {
    id: crypto.randomUUID(),
    title: formData.get("title").trim(),
    date: formData.get("date"),
    time: formData.get("time"),
    place: formData.get("place").trim(),
    quota: Number(formData.get("quota")),
    tag: formData.get("tag") || "其他",
    desc: formData.get("desc")?.trim() || ""
  };
  sessions.push(item);
  saveSessions(sessions);
  renderCards();
  createForm.reset();
  createForm.classList.remove("was-validated");
  descCount.textContent = "0 / 120";
  const toastEl = document.getElementById("createToast");
  new bootstrap.Toast(toastEl).show();
});

(function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || "light";
  document.documentElement.setAttribute("data-theme", saved);
  themeToggle.checked = saved === "dark";
})();
themeToggle.addEventListener("change", () => {
  const mode = themeToggle.checked ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem(STORAGE_KEYS.theme, mode);
});

renderCards();
