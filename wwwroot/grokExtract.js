// Grok extraction helper.
// Grok renders the answer client-side; server-side HTML fetch typically returns only the Next.js shell.
// This function loads Grok, waits for answer DOM elements, and returns the extracted text.

async function grokCommonFix(obdCode, query) {
  const url = `https://grok.com/?q=${encodeURIComponent(query)}`;

  // Create an off-DOM iframe to avoid navigating away from the app.
  const iframe = document.createElement('iframe');
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  iframe.style.opacity = '0';
  iframe.style.position = 'absolute';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  const timeoutMs = 20000;
  const start = Date.now();

  // Try multiple selectors; Grok DOM can change.
  const answerSelectors = [
    '[data-testid="message-content"]',
    '.answer',
    '[class*="answer"]',
    'main',
    'body'
  ];

  function cleanText(s) {
    if (!s) return '';
    return String(s)
      .replace(/\s+/g, ' ')
      .trim();
  }

  function firstSentences(text, maxSentences) {
    const parts = text.split(/(?<=[.!?])\s+/g).map(x => x.trim()).filter(Boolean);
    if (parts.length === 0) return text;
    return parts.slice(0, maxSentences).join(' ');
  }

  try {
    iframe.src = url;

    // Wait for iframe content to become readable.
    // NOTE: If Grok uses cross-origin restrictions preventing access to iframe DOM,
    // the extraction will fail and we return empty string.
    while (Date.now() - start < timeoutMs) {
      await new Promise(r => setTimeout(r, 300));

      let doc;
      try {
        doc = iframe.contentDocument || iframe.contentWindow?.document;
      } catch {
        // Cross-origin; cannot access DOM.
        break;
      }

      if (!doc) continue;

      for (const sel of answerSelectors) {
        const nodes = doc.querySelectorAll(sel);
        if (!nodes || nodes.length === 0) continue;

        // Prefer the last nodes (often the latest answer), but keep best-effort.
        for (let i = nodes.length - 1; i >= 0; i--) {
          const node = nodes[i];
          const txt = cleanText(node.innerText || node.textContent);
          if (txt && txt.length > 30) {
            // Return just a short snippet.
            return firstSentences(txt, 3);
          }
        }
      }
    }

    return '';
  } finally {
    try {
      iframe.remove();
    } catch {
      // ignore
    }
  }
}

window.grokCommonFix = grokCommonFix;

