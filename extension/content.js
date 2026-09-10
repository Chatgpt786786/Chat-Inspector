console.log("Chat-Inspector extension loaded");

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      console.log("🔔 Page content changed:", new Date().toISOString());
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
