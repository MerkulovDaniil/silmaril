// Tree toggle
document.addEventListener('click', function(e) {
    const item = e.target.closest('.tree-dir > .tree-item');
    if (item) { e.preventDefault(); item.parentElement.classList.toggle('open'); }
});

// Sidebar toggle
const menuBtn = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const isMobile = () => window.innerWidth <= 768;
function toggleMenu(open) {
    if (isMobile()) {
        const o = open !== undefined ? open : !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', o);
        overlay.classList.toggle('open', o);
        document.body.style.overflow = o ? 'hidden' : '';
    } else {
        const hidden = sidebar.classList.toggle('hidden');
        document.querySelector('.main-wrapper').style.marginLeft = hidden ? '0' : '';
    }
}
if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(false));
}

// Search
const si = document.getElementById('sidebar-search');
if (si) {
    let debounce;
    si.addEventListener('input', function() {
        clearTimeout(debounce);
        const q = this.value.trim();
        const items = document.querySelectorAll('.tree-file');
        const dirs = document.querySelectorAll('.tree-dir');
        if (!q) {
            items.forEach(i => i.style.display = '');
            dirs.forEach(d => { d.style.display = ''; d.classList.remove('open'); });
            document.querySelector('.search-results').innerHTML = '';
            return;
        }
        // Tree filter
        const ql = q.toLowerCase();
        items.forEach(i => {
            i.style.display = i.querySelector('.tree-item').textContent.toLowerCase().includes(ql) ? '' : 'none';
        });
        dirs.forEach(d => {
            const vis = d.querySelector('.tree-file:not([style*="display: none"])');
            d.style.display = vis ? '' : 'none';
            if (vis) d.classList.add('open');
        });
        // API search (debounced)
        if (q.length >= 2) {
            debounce = setTimeout(() => {
                fetch('/api/search?q=' + encodeURIComponent(q))
                    .then(r => r.json())
                    .then(results => {
                        const c = document.querySelector('.search-results');
                        if (!results.length) { c.innerHTML = '<div style="padding:6px 8px;color:var(--text2);font-size:12px;">Nothing found</div>'; return; }
                        c.innerHTML = results.slice(0, 15).map(r =>
                            '<a class="sr-item" href="/view/' + encodeURIComponent(r.path) + '">' +
                            '<div>' + r.name + '</div>' +
                            '<div class="sr-path">' + r.path + '</div>' +
                            (r.match ? '<div class="sr-match">...' + r.match + '...</div>' : '') + '</a>'
                        ).join('');
                    });
            }, 200);
        }
    });
}

// Tab in textarea
const ea = document.querySelector('.edit-area');
if (ea) {
    ea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const s = this.selectionStart, end = this.selectionEnd;
            this.value = this.value.substring(0, s) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = s + 4;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); this.closest('form').submit(); }
    });
}

// Close sidebar on nav (mobile)
document.querySelectorAll('.sidebar a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth <= 768) toggleMenu(false); });
});

// Copy buttons on code blocks
document.querySelectorAll('pre > code').forEach(function(block) {
    const pre = block.parentNode;
    // Wrap pre in a container for sticky button
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.style.cssText = 'position:absolute;top:6px;right:6px;padding:2px 8px;font-size:11px;background:var(--surface);border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--text2);opacity:0;transition:opacity 0.15s;z-index:1;';
    wrap.appendChild(btn);
    wrap.addEventListener('mouseenter', () => btn.style.opacity = '1');
    wrap.addEventListener('mouseleave', () => btn.style.opacity = '0');
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 1500);
        });
    });
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') lucide.createIcons();

// KaTeX auto-render
document.addEventListener('DOMContentLoaded', function() {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
});
