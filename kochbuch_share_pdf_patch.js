(function () {
  function injectStyles() {
    if (document.getElementById('recipe-share-pdf-styles')) return;
    const style = document.createElement('style');
    style.id = 'recipe-share-pdf-styles';
    style.textContent = `
      .share-actions{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 14px}
      .share-btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border-radius:10px;text-decoration:none;border:1px solid #d1d5db;background:#f9fafb;color:#111827;font-weight:700;cursor:pointer}
      .share-btn:hover{background:#f3f4f6}
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
    window.open('https://wa.me/?text=' + text, '_blank', 'noopener');
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

  function printRecipe(btn) {
    const section = btn.closest('.recipe');
    const title = getRecipeTitle(section);
    const clone = section.cloneNode(true);
    clone.querySelectorAll('.share-actions, .share-msg').forEach(el => el.remove());

    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) {
      alert('Popup wurde blockiert. Bitte Popups für diese Seite erlauben.');
      return;
    }

    win.document.open();
    win.document.write(`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:28px;line-height:1.45}
img{max-width:320px;height:auto;border-radius:10px;border:1px solid #ddd}
h1,h2,h3{margin-top:0}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.meta{margin:0 0 12px 0}
.tag{display:inline-block;padding:6px 10px;border:1px solid #ddd;border-radius:999px;margin-right:8px;margin-bottom:8px}
@media print{body{padding:0}}
</style>
</head>
<body>
${clone.outerHTML}
<script>window.onload=function(){setTimeout(function(){window.print();},250)}<\/script>
</body>
</html>`);
    win.document.close();
  }

  function addButtonsToRecipe(section) {
    if (section.querySelector('.share-actions')) return;
    const h2 = section.querySelector('h2');
    if (!h2) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'share-actions';
    wrapper.innerHTML = `
      <button type="button" class="share-btn">WhatsApp teilen</button>
      <button type="button" class="share-btn">Link kopieren</button>
      <button type="button" class="share-btn">PDF / Drucken</button>
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