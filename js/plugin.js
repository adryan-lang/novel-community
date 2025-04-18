// js/plugin.js

// 1) منع النسخ وإظهار رسالة
;(function(){
  const style = document.createElement('style');
  style.innerHTML = `
    .chapter-content {
      user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -webkit-touch-callout: none;
    }
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
    if (document.querySelector('.copy-toast')) return;
    const t = document.createElement('div');
    t.className = 'copy-toast';
    t.innerText = '❗ النسخ ممنوع';
    document.body.appendChild(t);
    setTimeout(()=> t.classList.add('visible'), 10);
    setTimeout(()=> t.remove(), 3100);
  }

  document.addEventListener('copy', e=>{
    if (e.target.closest('.chapter-content')) {
      e.preventDefault();
      showToast();
    }
  });
})();

// 2) نظام الإيموجي مع حفظ فعلي في قاعدة بيانات عبر Netlify + FaunaDB
;(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const container = document.querySelector('.reactions[data-chapter-id]');
    if (!container) return;
    const chapterId = container.dataset.chapterId;
    const buttons = container.querySelectorAll('.react-btn');
    const storageKey = `reacted_${chapterId}`;

    buttons.forEach(btn => btn.disabled = true);

    // جلب الأعداد من السيرفر
    fetch(`/.netlify/functions/getReactions?chapter=${chapterId}`)
      .then(res => res.json())
      .then(data => {
        buttons.forEach(btn => {
          const type = btn.dataset.reaction;
          btn.querySelector('.count').innerText = data[type] || 0;
          btn.disabled = false;
        });

        const prev = localStorage.getItem(storageKey);
        if (prev) {
          buttons.forEach(btn => {
            if (btn.dataset.reaction === prev) btn.classList.add('selected');
            btn.disabled = true;
          });
        }
      });

    // عند الضغط
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const reaction = btn.dataset.reaction;
        fetch('/.netlify/functions/addReaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapter: chapterId, reaction })
        })
        .then(res => res.json())
        .then(data => {
          buttons.forEach(btn => {
            const type = btn.dataset.reaction;
            btn.querySelector('.count').innerText = data[type] || 0;
            btn.disabled = true;
            if (type === reaction) btn.classList.add('selected');
          });
          localStorage.setItem(storageKey, reaction);
        });
      });
    });
  });
})();
