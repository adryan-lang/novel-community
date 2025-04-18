// محتوى الملف js/plugin.js

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

// 2) نظام الإيموجي البسيط LocalStorage
;(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const container = document.querySelector('.reactions[data-chapter-id]');
    if (!container) return;
    const chapterId = container.dataset.chapterId;
    const buttons = container.querySelectorAll('.react-btn');

    // تحميل وعرض الأعداد من localStorage
    buttons.forEach(btn=>{
      const key = `${chapterId}_${btn.dataset.reaction}`;
      const cnt = parseInt(localStorage.getItem(key)) || 0;
      btn.querySelector('.count').innerText = cnt;
      if (cnt > 0) disableAll();
    });

    // حدث الضغط
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
