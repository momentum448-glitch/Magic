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
    "AS": "https://drive.google.com/thumbnail?id=1zOSL_PvKGOuvVYcntrlUdwFMLqMIyoPX&sz=w1600",
    "7H": "https://drive.google.com/thumbnail?id=1ddxzYL7srwp4muqlk3oJ6ETNEe4KoyN-&sz=w1600",
    "QD": "https://drive.google.com/thumbnail?id=1AqI0eDInTZduNS01SEpHZQwXN24q2yfe&sz=w1600",
    "KC": "https://drive.google.com/thumbnail?id=1-J7WPJ-OoAnhiV8JmuFLh0qthE2w4TEm&sz=w1600",
    "10S": "https://drive.google.com/thumbnail?id=11Xoi6Z1lPZfzCPCVCzuNeehzqRZ-rgc-&sz=w1600",
    "2S": "https://drive.google.com/thumbnail?id=1nHGhxCHHUTyZ3VhqFKjIH8GnqcMMmEM7&sz=w1600",
    "3S": "https://drive.google.com/thumbnail?id=1BES-zoasXvuK_BCYst6u1fVyWo--7UeQ&sz=w1600",
    "4S": "https://drive.google.com/thumbnail?id=1ZGZ-AspDRQ9xU8H8F5qFctwaP9Z-r3W3&sz=w1600",
    "5S": "https://drive.google.com/thumbnail?id=14XixqbS55JijLi4UtSRYuCUgoZlQiS-g&sz=w1600",
    "6S": "https://drive.google.com/thumbnail?id=1ex-tJgkwUtrYk--hO-mMIeQaWwUW_f6_&sz=w1600",
    "7S": "https://drive.google.com/thumbnail?id=11x1dKN9yysFTCkbIhtIyoWruew6EsbsV&sz=w1600",
    "8S": "https://drive.google.com/thumbnail?id=1ptq93_AG2ERj_1yTqFwEWzIJ6j3GEWp-&sz=w1600",
    "9S": "https://drive.google.com/thumbnail?id=13-v2yyELZc5cBJ08rrpNBAW_3OIy7U5J&sz=w1600",
    "AH": "https://drive.google.com/thumbnail?id=1NLTVLiJ21hdS8L7qbcWe5hCzvp5DYU0y&sz=w1600",
    "2H": "https://drive.google.com/thumbnail?id=16l8RB910as03Di8VZEPV7GANQe7sLL_E&sz=w1600",
    "3H": "https://drive.google.com/thumbnail?id=1Rt7FRvgGppau_d7Ow7E6vHCKxB7VW28-&sz=w1600",
    "4H": "https://drive.google.com/thumbnail?id=1mKu5zqzpSoTl-1CW3VNW6XuonJkcfn19&sz=w1600",
    "5H": "https://drive.google.com/thumbnail?id=1Xd8Ge36FwcqQgGMyJpBiJuJePcX7zPPN&sz=w1600",
    "6H": "https://drive.google.com/thumbnail?id=12en70t51pW1KCrIiftHeNK_s6DIhVM3R&sz=w1600",
    "8H": "https://drive.google.com/thumbnail?id=15T7OJ_JU8XCvEQF0lAdKjsKRPxSyUaKq&sz=w1600",
    "9H": "https://drive.google.com/thumbnail?id=1vgNK--KwlZeDI-l1mbiz2GmhtVct3e2n&sz=w1600",
    "10H": "https://drive.google.com/thumbnail?id=1sr6tuTZr7rtL004T2elbHnR8EW3MTHW3&sz=w1600",
    "JH": "https://drive.google.com/thumbnail?id=1FprGMAdkD4IKViyKqdElLi4mW3PRF8Yt&sz=w1600",
    "QH": "https://drive.google.com/thumbnail?id=1qTHd_XwipULLKgsgrpapgtM-JXOCwqTT&sz=w1600",
    "KH": "https://drive.google.com/thumbnail?id=12poeZ528nKf61wweea8g5-o9xJIb7buB&sz=w1600",
    "AD": "https://drive.google.com/thumbnail?id=1P0s1mQ-yHIOKsMRNuBvrtywvZgvZFJpp&sz=w1600",
    "2D": "https://drive.google.com/thumbnail?id=1vRhjfQTzffWNAmhphNkfSuEH52V1Rtxf&sz=w1600"
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
