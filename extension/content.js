// Chat-Inspector
// VERSION 0.2 — Visible DOM message detection test
// No server / database / Telegram connection yet.

console.log("✅ Chat-Inspector v0.2 loaded");

const seen = new Set();

function cleanText(text) {
  return (text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsefulText(text) {
  if (!text) return false;
  if (text.length > 2000) return false;

  const ignore = new Set([
    "Search Facebook",
    "Search Messenger",
    "Message",
    "Send",
    "Like",
    "Comment",
    "Share"
  ]);

  return !ignore.has(text);
}

function makeKey(text, element) {
  // Text अकेला unique ID नहीं है।
  // Element + text का temporary key इस्तेमाल करेंगे।
  return text + "||" + String(element);
}

function detectMessageElement(element) {
  if (!(element instanceof HTMLElement)) return;

  const text = cleanText(
    element.innerText || element.textContent || ""
  );

  if (!isUsefulText(text)) return;

  // बहुत बड़े containers को message न मानें
  if (text.length > 500) return;

  const key = makeKey(text, element);

  if (seen.has(key)) return;
  seen.add(key);

  // Memory limit
  if (seen.size > 2000) {
    const first = seen.values().next().value;
    seen.delete(first);
  }

  const record = {
    text: text,
    detectedAt: new Date().toISOString(),
    page: location.href
  };

  console.log("📩 MESSAGE DETECTED");
  console.table(record);

  // Test के लिए browser event भी fire करेंगे
  window.dispatchEvent(
    new CustomEvent("CHAT_INSPECTOR_MESSAGE", {
      detail: record
    })
  );
}

function scanNode(node) {
  if (!(node instanceof HTMLElement)) return;

  detectMessageElement(node);

  if (node.querySelectorAll) {
    const children = node.querySelectorAll("*");

    for (const child of children) {
      detectMessageElement(child);
    }
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      scanNode(node);
    }
  }
});

function startObserver() {
  if (!document.body) {
    setTimeout(startObserver, 500);
    return;
  }

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("🟢 Chat-Inspector: DOM monitoring ACTIVE");

  // Initial visible-page scan
  scanNode(document.body);
}

startObserver();
