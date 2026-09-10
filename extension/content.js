// Chat-Inspector - Facebook visible message detector
// TEST VERSION: visible DOM detection only

console.log("✅ Chat-Inspector: Message detector loaded");

const seen = new Set();

function cleanText(text) {
  return (text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsefulText(text) {
  if (!text) return false;
  if (text.length < 1 || text.length > 2000) return false;

  const ignore = [
    "Search Facebook",
    "Search Messenger",
    "Message",
    "Send",
    "Like",
    "Comment",
    "Share"
  ];

  return !ignore.includes(text);
}

function detectMessageElement(el) {
  if (!(el instanceof HTMLElement)) return;

  const text = cleanText(el.innerText || el.textContent);

  if (!isUsefulText(text)) return;

  // Avoid processing the same visible element repeatedly
  const key = text;

  if (seen.has(key)) return;
  seen.add(key);

  // Keep memory under control
  if (seen.size > 1000) {
    const first = seen.values().next().value;
    seen.delete(first);
  }

  const data = {
    text: text,
    detectedAt: new Date().toISOString(),
    page: location.href
  };

  console.log("📩 MESSAGE DETECTED");
  console.log(data);
}

// Watch Facebook/Messenger DOM changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {

    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;

      // Check the added element
      detectMessageElement(node);

      // Check its children
      const elements = node.querySelectorAll
        ? node.querySelectorAll("*")
        : [];

      for (const el of elements) {
        detectMessageElement(el);
      }
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

  console.log("🟢 Chat-Inspector: DOM monitoring active");
}

startObserver();
