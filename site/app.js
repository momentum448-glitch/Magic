(() => {
  "use strict";

  const OWNER = "momentum448-glitch";
  const STATE_REPO = "Magic-state";
  const API_VERSION = "2022-11-28";
  const TOKEN_KEY = "magic_state_pat_session";
  const SETUP_TAPS_REQUIRED = 5;
  const SETUP_TAP_WINDOW_MS = 2500;

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

  const cardPhoto = document.getElementById("cardPhoto");
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
  const tapProgress = document.getElementById("tapProgress");

  let currentState = null;
  let selectedCode = null;
  let tapCount = 0;
  let tapResetTimer = null;
  let pendingSetupAfterArm = false;

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

  function assetCode(code) {
    return code.startsWith("10") ? "T" + code.slice(2) : code;
  }

  const PHOTO_ASSETS = {
    "AS": "https://drive.google.com/thumbnail?id=1okWmuD3WoPHZKlAOGZ7rcrtrTE5hU_tb&sz=w1600",
    "2S": "https://drive.google.com/thumbnail?id=1USY7O0iZa-SwnOj1G5ywxzkW3NpcfDF9&sz=w1600",
    "3S": "https://drive.google.com/thumbnail?id=1qoD1jRMDUf5XyG525bVxAv_UVMOZMcYd&sz=w1600",
    "4S": "https://drive.google.com/thumbnail?id=1K629WH9IYnd7IQUsDJZZ30NTsNdBAVpa&sz=w1600",
    "5S": "https://drive.google.com/thumbnail?id=1jmYd4MXH2Pqs8_evO2d1H5jBsvqMXYjm&sz=w1600",
    "6S": "https://drive.google.com/thumbnail?id=1ZScbrM5cotOhFr90LEH-uYJ11jxKcu4-&sz=w1600",
    "7S": "https://drive.google.com/thumbnail?id=1Z8b69IK5lJyRYvcPLSDSHzBAMwlG7NeE&sz=w1600",
    "8S": "https://drive.google.com/thumbnail?id=1tggeNlzBS-Xlgfb6ctzTrVV31heNIpTV&sz=w1600",
    "9S": "https://drive.google.com/thumbnail?id=1EpQv-3LXYjq9OSquvBqs2KymCf4V_XSD&sz=w1600",
    "10S": "https://drive.google.com/thumbnail?id=1TaaY-SHK3EO-4Ye75KJmCx9P4QMlIMmR&sz=w1600",
    "JS": "https://drive.google.com/thumbnail?id=1k8iCsU4bGctw3tw0dpLi4sDrHdslN18z&sz=w1600",
    "QS": "https://drive.google.com/thumbnail?id=16WQeAdEGqb-mrGZ3HNPnt11kVckK47qt&sz=w1600",
    "KS": "https://drive.google.com/thumbnail?id=1XkSfjFD5XIUzQLBN7uipVOG02ZVdUz9l&sz=w1600",

    "AH": "https://drive.google.com/thumbnail?id=1f4YTDBpyZXoHRpTc7oNiQ9FH22K83Q5X&sz=w1600",
    "2H": "https://drive.google.com/thumbnail?id=13sPqbJovbUOJNaxIjEzVboBxCHjvuHvV&sz=w1600",
    "3H": "https://drive.google.com/thumbnail?id=11EqVCQoqhzLKHnBv5tmFM6yG_nW_Le79&sz=w1600",
    "4H": "https://drive.google.com/thumbnail?id=1ZLN77vqZou7V64i892KPB4Eer-CVoFuk&sz=w1600",
    "5H": "https://drive.google.com/thumbnail?id=1WwDmZ-EmPyMCZKx_n-X8qwhN_AnYWf31&sz=w1600",
    "6H": "https://drive.google.com/thumbnail?id=1jxOOTgpuKOf38NDEtUHnBt7E2sj4Hdpa&sz=w1600",
    "7H": "https://drive.google.com/thumbnail?id=1-u8pkWMf0iC3xeH1VL8cCHdqClanIscn&sz=w1600",
    "8H": "https://drive.google.com/thumbnail?id=1SNeBYoYWq6g_eQxXV9-3WDIkv53J6Ux-&sz=w1600",
    "9H": "https://drive.google.com/thumbnail?id=18kCq9atImnTDknguL8GFFikVKestjVc4&sz=w1600",
    "10H": "https://drive.google.com/thumbnail?id=1dRV5ibYH0D2a8Q-y19_iIf5c7UCPKiQo&sz=w1600",
    "JH": "https://drive.google.com/thumbnail?id=1Mh3FmbAIjnFO_Ig7CdlfXyvJpE1O4GeF&sz=w1600",
    "QH": "https://drive.google.com/thumbnail?id=1CWsuoyHz-s3PKQRluGoluDVE2Zhm9p95&sz=w1600",
    "KH": "https://drive.google.com/thumbnail?id=1tKNQSktIZ9YDXS3oitJ39JUP88sRXbY1&sz=w1600",

    "AD": "https://drive.google.com/thumbnail?id=1sYlkPZs2S8hSPsNnEXugof56luPzmjsJ&sz=w1600",
    "2D": "https://drive.google.com/thumbnail?id=10j1e-v-AU2FUeqFKadPb2-4xLQBlSx9E&sz=w1600",
    "3D": "https://drive.google.com/thumbnail?id=1h-r3d12UVZkyLmrJhK1BHGxplWW1y6eg&sz=w1600",
    "4D": "https://drive.google.com/thumbnail?id=1Hu5BEJMx_spRwqZ1BEAzbjnGpsrfp9NS&sz=w1600",
    "5D": "https://drive.google.com/thumbnail?id=1uHJhcvtAOn_Oy9W2MXZEciES5Q_o-Wqz&sz=w1600",
    "6D": "https://drive.google.com/thumbnail?id=1mxIiZ6NPgXwE65Q77t-FWRiTmSkWymxS&sz=w1600",
    "7D": "https://drive.google.com/thumbnail?id=1-AYZBsLgKlDjJI7XJp3G1CDuTg20WVDl&sz=w1600",
    "8D": "https://drive.google.com/thumbnail?id=10y99KGENbrOYtOMI8PaIKwQSByQxlnrW&sz=w1600",
    "9D": "https://drive.google.com/thumbnail?id=1IRt670eoh13vmW6von0GqAmtJ2gfNRj4&sz=w1600",
    "10D": "https://drive.google.com/thumbnail?id=1XMPt5ptjRxpvORZ8UWV5rxDUavZ7z1ly&sz=w1600",
    "JD": "https://drive.google.com/thumbnail?id=1l3tHHmIzeqbR4iF-ewl3KAXyC6EsOeo1&sz=w1600",
    "QD": "https://drive.google.com/thumbnail?id=1vEXUBmTQdLYzH2zC1faSqOd2D0LNQsFd&sz=w1600",
    "KD": "https://drive.google.com/thumbnail?id=1B_GEoGdXBd4pAd_VawVtSP82wrQl6qPr&sz=w1600",

    "AC": "https://drive.google.com/thumbnail?id=1IBtgIUzIaW5OQJEzo50w9bkCY6Ynxxgs&sz=w1600",
    "2C": "https://drive.google.com/thumbnail?id=1wqmyeRKaBEF73sGrODACfdWVUUp_Oxml&sz=w1600",
    "3C": "https://drive.google.com/thumbnail?id=1kL4Eug-wtzQhJ9qZvmn6ceG3NS1EGgsw&sz=w1600",
    "4C": "https://drive.google.com/thumbnail?id=1YvH8fuEOvqRRPtK6wAwOdDq8OEGTJPjk&sz=w1600",
    "5C": "https://drive.google.com/thumbnail?id=1ZEZ_DVZ5V9dnRy1-QPX4e15z1gkkoktP&sz=w1600",
    "6C": "https://drive.google.com/thumbnail?id=1BYlF5jMDtrcnyK6kbK0bLGnWkwCN4RnR&sz=w1600",
    "7C": "https://drive.google.com/thumbnail?id=1qdT9GW00S9UOsLpJiOWvA20WEWjL1J5t&sz=w1600",
    "8C": "https://drive.google.com/thumbnail?id=17miK22r2zQ2nAdAkb9VmOWa0vFlzj9kc&sz=w1600",
    "9C": "https://drive.google.com/thumbnail?id=1LN5TS5rRjxPQZCUc9aHMoIlyCPdZIE7c&sz=w1600",
    "10C": "https://drive.google.com/thumbnail?id=1IsYn98YF5MZyYeIZta63Wu7-BzF4vgtu&sz=w1600",
    "JC": "https://drive.google.com/thumbnail?id=1X8vhjEqlnip0Asr3vjjM1s7Rd50AE385&sz=w1600",
    "QC": "https://drive.google.com/thumbnail?id=1zdICR-FA1oOvcOslB8TRwurEkyCayEUL&sz=w1600",
    "KC": "https://drive.google.com/thumbnail?id=1rhUKiJ9GCHfSordFQ9E0jpqKBqGyAjU1&sz=w1600"
  };

  function vectorCardAssetUrl(code) {
    return `https://raw.githubusercontent.com/block52/cards/main/${assetCode(code)}.svg`;
  }

  function cardAsset(code) {
    return PHOTO_ASSETS[code]
      ? { url: PHOTO_ASSETS[code], isPhoto: true }
      : { url: vectorCardAssetUrl(code), isPhoto: false };
  }

  function renderCard(code) {
    const p = cardParts(code);
    if (!p) throw new Error("Invalid card code");

    const frame = cardPhoto.closest(".photo-frame");
    const asset = cardAsset(code);
    let fallbackTried = false;

    frame?.classList.toggle("scene-photo", asset.isPhoto);
    cardPhoto.classList.add("is-loading");
    cardPhoto.alt = labelFor(code);

    cardPhoto.onload = () => {
      cardPhoto.classList.remove("is-loading");
      statusText.textContent = "";
    };

    cardPhoto.onerror = () => {
      if (asset.isPhoto && !fallbackTried) {
        fallbackTried = true;
        frame?.classList.remove("scene-photo");
        cardPhoto.src = vectorCardAssetUrl(code);
        return;
      }
      cardPhoto.classList.add("is-loading");
      statusText.textContent = "Ảnh chưa tải được. Hãy thử mở lại.";
    };

    cardPhoto.src = asset.url;
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
    } catch (err) {
      console.error(err);
      cardPhoto.classList.add("is-loading");
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
    if (!validChannel) return;

    if (!token()) {
      pendingSetupAfterArm = true;
      tokenInput.value = "";
      armStatus.textContent = "Arm thiết bị để mở setup.";
      if (!armDialog.open) armDialog.showModal();
      return;
    }

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

  function resetSetupTapSequence() {
    tapCount = 0;
    clearTimeout(tapResetTimer);
    tapResetTimer = null;
    tapProgress.textContent = "0/5";
  }

  function registerSetupTap(e) {
    e.preventDefault();
    clearTimeout(tapResetTimer);
    tapCount += 1;
    tapProgress.textContent = `${tapCount}/${SETUP_TAPS_REQUIRED}`;

    if (tapCount >= SETUP_TAPS_REQUIRED) {
      resetSetupTapSequence();
      openSetup();
      return;
    }

    tapResetTimer = setTimeout(resetSetupTapSequence, SETUP_TAP_WINDOW_MS);
  }

  hotspot.addEventListener("click", registerSetupTap);
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
    setTimeout(() => {
      armDialog.close();
      if (pendingSetupAfterArm) {
        pendingSetupAfterArm = false;
        openSetup();
      }
    }, 350);
  });

  clearTokenButton.addEventListener("click", () => {
    sessionStorage.removeItem(TOKEN_KEY);
    tokenInput.value = "";
    pendingSetupAfterArm = false;
    armStatus.textContent = "Đã xóa token khỏi session.";
  });

  function maybeOpenArm() {
    if (location.hash === "#arm") {
      pendingSetupAfterArm = false;
      tokenInput.value = token();
      if (!armDialog.open) armDialog.showModal();
    }
  }

  window.addEventListener("hashchange", maybeOpenArm);

  buildDeck();
  loadReveal();
  maybeOpenArm();
})();
