/* Memory secure loader — aucun PIN ni mot en clair n'est stocké ici. */
"use strict";

window.memoryWords = [];
window.memoryUnlocked = false;

const WORDS_FILE = "data/words.enc";
const lockScreen = document.getElementById("lockScreen");
const pinMessage = document.getElementById("pinMessage");
const dots = [...document.querySelectorAll("#pinDots i")];
let enteredPin = "";
let busy = false;

document.body.classList.add("locked");

document.querySelectorAll("[data-pin]").forEach(btn => {
  btn.addEventListener("click", () => addDigit(btn.dataset.pin));
});
document.getElementById("pinBack").addEventListener("click", () => {
  if (busy) return;
  enteredPin = enteredPin.slice(0, -1);
  updateDots();
  setMessage("Entre ton code à 4 chiffres", "");
});

document.addEventListener("keydown", e => {
  if (window.memoryUnlocked || busy) return;
  if (/^\d$/.test(e.key)) addDigit(e.key);
  if (e.key === "Backspace") {
    enteredPin = enteredPin.slice(0, -1);
    updateDots();
  }
});

function addDigit(digit) {
  if (busy || enteredPin.length >= 4) return;
  enteredPin += digit;
  updateDots();
  if (enteredPin.length === 4) unlock();
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle("filled", i < enteredPin.length));
}

function setMessage(text, kind) {
  pinMessage.textContent = text;
  pinMessage.className = "pin-message" + (kind ? " " + kind : "");
}

async function unlock() {
  busy = true;
  setMessage("Déchiffrement…", "");
  try {
    const response = await fetch(WORDS_FILE, { cache: "no-store" });
    if (!response.ok) throw new Error("Fichier words.enc introuvable.");
    const payload = await response.json();

    const words = await decryptWords(payload, enteredPin);
    if (!Array.isArray(words) || words.length < 2 || words.some(w => typeof w !== "string")) {
      throw new Error("Contenu invalide.");
    }

    window.memoryWords = words;
    window.memoryUnlocked = true;
    enteredPin = "";
    setMessage("Déverrouillé", "ok");
    document.body.classList.remove("locked");
    lockScreen.classList.add("unlocked");
    window.dispatchEvent(new CustomEvent("memory-unlocked", { detail: { words } }));
  } catch (err) {
    enteredPin = "";
    updateDots();
    setMessage("Code incorrect", "error");
    if (navigator.vibrate) navigator.vibrate(120);
  } finally {
    busy = false;
  }
}

async function decryptWords(payload, pin) {
  if (payload.v !== 1 || payload.alg !== "AES-GCM" || payload.kdf !== "PBKDF2-SHA256") {
    throw new Error("Format non supporté.");
  }

  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: b64ToBytes(payload.salt),
      iterations: payload.iterations,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(payload.iv) },
    key,
    b64ToBytes(payload.data)
  );

  return JSON.parse(new TextDecoder().decode(plain));
}

function b64ToBytes(b64) {
  const binary = atob(b64);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
