from pathlib import Path
js = r"""(function () {
  function injectStyles() {
    if (document.getElementById('recipe-share-pdf-styles')) return;
    const style = document.createElement('style');
    style.id = 'recipe-share-pdf-styles';
    style.textContent = `
      .share-actions{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 14px}
      .share-btn{
        display:inline-flex;align-items:center;justify-content:center;gap:8px;
        padding:8px 12px;border-radius:10px;text-decoration:none;border:1px solid #d1d5db;
        background:#f9fafb;color:#111827;font-weight:700;cursor:pointer
      }
      .share-btn:hover{background:#f3f4f6}
      .share-btn svg{width:18px;height:18px;display:block;flex:0 0 auto}
      .share-btn.whatsapp-btn svg{color:#25D366}
      .share-msg{font-size:12px;color:#065f46;margin-top:6px;display:none}
    `;
    document.head.appendChild(style);
  }

  function getRecipeTitle(section) {
    const h2 = section.querySelector('h2');
    return h2 ? h2.textContent.trim() : 'Rezept';
  }

  function getRecipeUrl(section) {
    return window.location.origin + window.location.pathname + '#' + section.id;
  }

  function shareWhatsApp(btn) {
    const section = btn.closest('.recipe');
    const title = getRecipeTitle(section);
    const url = getRecipeUrl(section);
    const text = encodeURIComponent('Schau dir dieses Rezept an: ' + title + ' ' + url);
    window.open('https://wa.me/?text=' + text, '_blank');
  }

  async function copyRecipeLink(btn) {
    const section = btn.closest('.recipe');
    const url = getRecipeUrl(section);
    await navigator.clipboard.writeText(url);
    const msg = section.querySelector('.share-msg');
    if (msg) {
      msg.style.display = 'block';
      clearTimeout(msg._hideTimer);
      msg._hideTimer = setTimeout(() => { msg.style.display = 'none'; }, 1800);
    }
  }

  function absolutizeImages(root) {
    root.querySelectorAll('img').forEach(img => {
      try {
        img.src = new URL(img.getAttribute('src'), window.location.href).href;
      } catch (_) {}
    });
  }

  function buildPrintHtml(section, title) {
    const clone = section.cloneNode(true);
    clone.querySelectorAll('.share-actions, .share-msg').forEach(el => el.remove());
    absolutizeImages(clone);

    return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:28px;line-height:1.45}
img{max-width:320px;height:auto;border-radius:10px;border:1px solid #ddd}
h1,h2,h3{margin-top:0}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.meta{margin:0 0 12px 0}
.tag{display:inline-block;padding:6px 10px;border:1px solid #ddd;border-radius:999px;margin-right:8px;margin-bottom:8px}
@media (max-width:700px){.grid-2{grid-template-columns:1fr}}
@media print{body{padding:0}}
</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;
  }

  function printRecipe(btn) {
    const section = btn.closest('.recipe');
    const title = getRecipeTitle(section);
    const html = buildPrintHtml(section, title);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const cleanup = () => {
      setTimeout(() => {
        try { iframe.remove(); } catch (_) {}
      }, 1500);
    };

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = function () {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          alert('Drucken/PDF konnte nicht gestartet werden.');
        } finally {
          cleanup();
        }
      }, 300);
    };

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (_) {}
    }, 700);
  }

  function addButtonsToRecipe(section) {
    if (section.querySelector('.share-actions')) return;
    const h2 = section.querySelector('h2');
    if (!h2) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'share-actions';
    wrapper.innerHTML = `
      <button type="button" class="share-btn whatsapp-btn" title="Per WhatsApp teilen" aria-label="Per WhatsApp teilen">
        <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
          <path d="M19.11 17.28c-.27-.13-1.58-.78-1.83-.87-.24-.09-.42-.13-.6.14-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.35-.8-.71-1.34-1.59-1.49-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.98-.22-.53-.44-.45-.6-.46h-.51c-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.25s.96 2.62 1.09 2.8c.13.18 1.89 2.89 4.58 4.05.64.27 1.13.43 1.52.55.64.2 1.23.17 1.69.1.52-.08 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.24-.18-.51-.31z"/>
          <path d="M16.02 3.2C8.95 3.2 3.21 8.94 3.21 16c0 2.26.59 4.47 1.7 6.41L3.11 28.8l6.57-1.72A12.73 12.73 0 0 0 16.02 28.8c7.07 0 12.8-5.74 12.8-12.8S23.09 3.2 16.02 3.2zm0 23.28c-1.94 0-3.83-.52-5.48-1.51l-.39-.23-3.9 1.02 1.04-3.8-.25-.39A10.43 10.43 0 0 1 5.59 16c0-5.75 4.68-10.43 10.43-10.43S26.45 10.25 26.45 16s-4.68 10.48-10.43 10.48z"/>
        </svg>
        <span>WhatsApp teilen</span>
      </button>
      <button type="button" class="share-btn" title="Link kopieren" aria-label="Link kopieren">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Link kopieren</span>
      </button>
      <button type="button" class="share-btn" title="PDF / Drucken" aria-label="PDF / Drucken">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        <span>PDF / Drucken</span>
      </button>
    `;

    const msg = document.createElement('div');
    msg.className = 'share-msg';
    msg.textContent = 'Link kopiert.';

    const buttons = wrapper.querySelectorAll('button');
    buttons[0].addEventListener('click', function () { shareWhatsApp(this); });
    buttons[1].addEventListener('click', function () { copyRecipeLink(this); });
    buttons[2].addEventListener('click', function () { printRecipe(this); });

    h2.insertAdjacentElement('afterend', wrapper);
    wrapper.insertAdjacentElement('afterend', msg);
  }

  function init() {
    injectStyles();
    document.querySelectorAll('section.recipe[id^="rezept-"]').forEach(addButtonsToRecipe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
"""

path = Path('/mnt/data/kochbuch_share_pdf_patch_v2.js')
path.write_text(js, encoding='utf-8')
print(path)
