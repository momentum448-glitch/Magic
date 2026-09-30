(() => {
  "use strict";

  const OWNER = "momentum448-glitch";
  const STATE_REPO = "Magic-state";
  const API_VERSION = "2022-11-28";
  const TOKEN_KEY = "magic_state_pat_session";
  const LONG_PRESS_MS = 2200;

  const params = new URLSearchParams(location.search);
  const channelId = (params.get("c") || "test01").trim();
  const validChannel = /^[A-Za-z0-9_-]{1,50}$/.test(channelId);

  const SUITS = [
    { code: "S", symbol: "♠", red: false, name: "Bích" },
    { code: "H", symbol: "♥", red: true,  name: "Cơ" },
    { code: "D", symbol: "♦", red: true,  name: "Rô" },
    { code: "C", symbol: "♣", red: false, name: "Tép" }
  ];
  const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const VALID_CODES = new Set(SUITS.flatMap(s => RANKS.map(r => r + s.code)));

  const cardEl = document.getElementById("card");
  const statusText = document.getElementById("statusText");
  const hotspot = document.getElementById("secretHotspot");
  const setupDialog = document.getElementById("setupDialog");
  const armDialog = document.getElementById("armDialog");
  const deckGrid = document.getElementById("deckGrid");
  const selectedLabel = document.getElementById("selectedLabel");
  const writeStatus = document.getElementById("writeStatus");
  const doneButton = document.getElementById("doneButton");
  const tokenInput = document.getElementById("tokenInput");
  const saveTokenButton = document.getElementById("saveTokenButton");
  const clearTokenButton = document.getElementById("clearTokenButton");
  const armStatus = document.getElementById("armStatus");

  let currentState = null;
  let selectedCode = null;
  let holdTimer = null;

  function statePath() {
    return `channels/${channelId}.json`;
  }

  function apiUrl() {
    return `https://api.github.com/repos/${OWNER}/${STATE_REPO}/contents/${statePath()}`;
  }

  function headers(token) {
    const h = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION
    };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }

  function decodeBase64Utf8(base64) {
    const binary = atob(base64.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function encodeBase64Utf8(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
  }

  function cardParts(code) {
    const suit = SUITS.find(s => s.code === code.slice(-1));
    const rank = code.slice(0, -1);
    return suit && RANKS.includes(rank) ? { suit, rank } : null;
  }

  function labelFor(code) {
    const p = cardParts(code);
    return p ? `${p.rank}${p.suit.symbol} · ${p.suit.name}` : "Không hợp lệ";
  }

  function renderCard(code) {
    const p = cardParts(code);
    if (!p) throw new Error("Invalid card code");
    cardEl.classList.remove("is-loading", "red");
    if (p.suit.red) cardEl.classList.add("red");
    cardEl.querySelectorAll(".rank").forEach(el => el.textContent = p.rank);
    cardEl.querySelectorAll(".suit").forEach(el => el.textContent = p.suit.symbol);
    cardEl.querySelector(".pip").textContent = p.suit.symbol;
    cardEl.setAttribute("aria-label", labelFor(code));
  }

  async function getState(token = null) {
    const url = apiUrl() + `?t=${Date.now()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: headers(token),
      cache: "no-store"
    });

    if (!res.ok) {
      const error = new Error(`GitHub GET failed: ${res.status}`);
      error.status = res.status;
      throw error;
    }

    const payload = await res.json();
    const text = decodeBase64Utf8(payload.content);
    const data = JSON.parse(text);
    if (!VALID_CODES.has(data.cardCode)) throw new Error("Invalid remote card");
    return { data, sha: payload.sha };
  }

  async function loadReveal() {
    if (!validChannel) {
      statusText.textContent = "Không thể tải ảnh.";
      return;
    }

    try {
      const result = await getState();
      currentState = result.data;
      selectedCode = currentState.cardCode;
      renderCard(currentState.cardCode);
      statusText.textContent = "";
    } catch (err) {
      console.error(err);
      cardEl.classList.add("is-loading");
      statusText.textContent = "Ảnh chưa tải được. Hãy thử mở lại.";
    }
  }

  function buildDeck() {
    deckGrid.replaceChildren();
    for (const rank of RANKS) {
      for (const suit of SUITS) {
        const code = rank + suit.code;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "deck-card" + (suit.red ? " red" : "");
        button.dataset.code = code;
        button.textContent = rank + suit.symbol;
        button.addEventListener("click", () => selectCard(code));
        deckGrid.appendChild(button);
      }
    }
  }

  function selectCard(code) {
    selectedCode = code;
    deckGrid.querySelectorAll(".deck-card").forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.code === code);
    });
    selectedLabel.textContent = labelFor(code);
    doneButton.disabled = false;
    writeStatus.textContent = "";
  }

  function token() {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  }

  function openSetup() {
    if (!token() || !validChannel) return;
    buildDeck();
    if (currentState?.cardCode) selectCard(currentState.cardCode);
    setupDialog.showModal();
  }

  async function updateStateOnce(newCode, tokenValue) {
    const latest = await getState(tokenValue);
    const next = {
      cardCode: newCode,
      version: Number(latest.data.version || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    const body = {
      message: `Set ${channelId} to ${newCode}`,
      content: encodeBase64Utf8(JSON.stringify(next, null, 2) + "\n"),
      sha: latest.sha
    };

    const res = await fetch(apiUrl(), {
      method: "PUT",
      headers: {
        ...headers(tokenValue),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.status === 409) {
      const error = new Error("Conflict");
      error.status = 409;
      throw error;
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const error = new Error(`GitHub PUT failed: ${res.status} ${detail}`);
      error.status = res.status;
      throw error;
    }

    await res.json();
    return next;
  }

  async function commitSelection() {
    const tokenValue = token();
    if (!tokenValue || !selectedCode) return;

    doneButton.disabled = true;
    writeStatus.textContent = "Đang cập nhật…";

    try {
      let next;
      try {
        next = await updateStateOnce(selectedCode, tokenValue);
      } catch (err) {
        if (err.status !== 409) throw err;
        writeStatus.textContent = "Đồng bộ lại…";
        next = await updateStateOnce(selectedCode, tokenValue);
      }

      currentState = next;
      renderCard(next.cardCode);
      writeStatus.textContent = "Đã sẵn sàng.";
      setTimeout(() => setupDialog.close(), 250);
    } catch (err) {
      console.error(err);
      writeStatus.textContent = err.status === 401 || err.status === 403
        ? "Token không có quyền ghi."
        : "Chưa cập nhật được. Thử lại.";
      doneButton.disabled = false;
    }
  }

  function startHold(e) {
    if (!token()) return;
    e.preventDefault();
    clearTimeout(holdTimer);
    holdTimer = setTimeout(openSetup, LONG_PRESS_MS);
  }

  function cancelHold() {
    clearTimeout(holdTimer);
    holdTimer = null;
  }

  hotspot.addEventListener("pointerdown", startHold);
  hotspot.addEventListener("pointerup", cancelHold);
  hotspot.addEventListener("pointercancel", cancelHold);
  hotspot.addEventListener("pointerleave", cancelHold);
  doneButton.addEventListener("click", commitSelection);

  saveTokenButton.addEventListener("click", async () => {
    const value = tokenInput.value.trim();
    if (!value) {
      armStatus.textContent = "Chưa nhập token.";
      return;
    }
    sessionStorage.setItem(TOKEN_KEY, value);
    armStatus.textContent = "Device armed cho session hiện tại.";
    history.replaceState(null, "", location.pathname + location.search);
    setTimeout(() => armDialog.close(), 350);
  });

  clearTokenButton.addEventListener("click", () => {
    sessionStorage.removeItem(TOKEN_KEY);
    tokenInput.value = "";
    armStatus.textContent = "Đã xóa token khỏi session.";
  });

  function maybeOpenArm() {
    if (location.hash === "#arm") {
      tokenInput.value = token();
      armDialog.showModal();
    }
  }

  window.addEventListener("hashchange", maybeOpenArm);

  buildDeck();
  loadReveal();
  maybeOpenArm();
})();
