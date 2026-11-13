/* The two header toggles shared by both pages: light or dark, and more or less detail. "Less detail" hides the
   descriptive sentences and leaves the structure, the numbers and the labels. Both choices are remembered per browser. */
(() => {
  const html = document.documentElement, get = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }, set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const theme = get('dd-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), detail = get('dd-detail', 'less');
  html.classList.toggle('dark', theme === 'dark'); html.classList.toggle('brief', detail === 'less');
  const mount = () => {
    const bar = document.querySelector('header.bar'); if (!bar || bar.querySelector('.toggles')) return;
    const t = document.createElement('div'); t.className = 'toggles';
    t.innerHTML = `<div class="seg" role="group" aria-label="Detail"><button data-detail="less">Less detail</button><button data-detail="more">More detail</button></div>
      <button class="themebtn" data-theme-toggle aria-label="Switch light and dark" title="Switch light and dark"></button>`;
    bar.appendChild(t);
    const paint = () => { const brief = html.classList.contains('brief'), dark = html.classList.contains('dark');
      t.querySelectorAll('[data-detail]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.detail === 'less') === brief)));
      const tb = t.querySelector('[data-theme-toggle]'); tb.textContent = dark ? '☀ Light' : '☾ Dark'; };
    t.addEventListener('click', (e) => {
      const d = e.target.closest('[data-detail]'); if (d) { html.classList.toggle('brief', d.dataset.detail === 'less'); set('dd-detail', d.dataset.detail); }
      if (e.target.closest('[data-theme-toggle]')) { const dark = html.classList.toggle('dark'); set('dd-theme', dark ? 'dark' : 'light'); }
      paint();
    });
    paint();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
