// محتوى الملف js/plugin.js

;(function(){
  // 1) أنماط التوست فقط (دون منع التحديد)
  const style = document.createElement('style');
  style.innerHTML = `
    .copy-toast {
      position: fixed;
      bottom: 20px; left: 50%;
      transform: translateX(-50%) translateY(100%);
      background: rgba(0,0,0,0.8);
      color: #fff; padding: .8em 1.2em;
      border-radius: .5em; opacity: 0;
      transition: transform .3s, opacity .3s;
      z-index: 1000;
    }
    .copy-toast.visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  function showToast(){
    let t = document.querySelector('.copy-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'copy-toast';
      t.innerText = '❗ النسخ ممنوع';
      document.body.appendChild(t);
    }
    t.classList.add('visible');
    setTimeout(() => {
      t.classList.remove('visible');
      t.remove();
    }, 3100);
  }

  // 2) اعتراض حدث النسخ عبر فحص التحديد داخل العنصر #content
  document.addEventListener('copy', e => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const content = document.getElementById('content');
    if (content && content.contains(range.commonAncestorContainer)) {
      e.preventDefault();   // يمنع النسخ
      showToast();          // يعرض التوست
    }
  });
})();

// ------------------------------
// 3) نظام الإيموجي (كما في السابق)
// ------------------------------
;(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const container = document.querySelector('.reactions[data-chapter-id]');
    if (!container) return;
    const chapterId = container.dataset.chapterId;
    const buttons = container.querySelectorAll('.react-btn');

    buttons.forEach(btn=>{
      const key = `${chapterId}_${btn.dataset.reaction}`;
      const cnt = parseInt(localStorage.getItem(key)) || 0;
      btn.querySelector('.count').innerText = cnt;
      if (cnt > 0) disableAll();
    });

    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        buttons.forEach(b=>{
          const key = `${chapterId}_${b.dataset.reaction}`;
          const newCount = (b === btn ? 1 : 0);
          localStorage.setItem(key, newCount);
          b.querySelector('.count').innerText = newCount;
        });
        disableAll();
      });
    });

    function disableAll(){
      buttons.forEach(b=> b.disabled = true);
    }
  });
})();
