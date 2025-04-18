// js/plugin.js
;(function(){
  // 1) إضافة أنماط: منع تحديد النص في .chapter-content، وتنسيق التوست
  const style = document.createElement('style');
  style.innerHTML = `
    .chapter-content {
      user-select: none !important;
      -webkit-user-select: none !important;
      -ms-user-select: none !important;
      -webkit-touch-callout: none !important;
    }
    .copy-toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      background: rgba(0,0,0,0.8);
      color: #fff;
      padding: .8em 1.2em;
      border-radius: .5em;
      opacity: 0;
      transition: transform .3s, opacity .3s;
      z-index: 10000;
    }
    .copy-toast.visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // 2) دالة إظهار التوست
  function showToast(){
    let t = document.querySelector('.copy-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'copy-toast';
      t.innerText = '❗ النسخ ممنوع';
      document.body.appendChild(t);
    }
    // إعادة إظهار حتى لو كان موجود
    t.classList.add('visible');
    setTimeout(()=>{
      t.classList.remove('visible');
      t.remove();
    }, 3100);
  }

  // 3) اختيار حاوية المحتوى
  const content = document.querySelector('.chapter-content');

  // 4) اعتراض أمر النسخ (Ctrl/Cmd+C)
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0 && content.contains(sel.anchorNode)) {
        e.preventDefault();
        showToast();
      }
    }
  });

  // 5) اعتراض زرّ الفأرة الأيمن (قائمة النسخ)
  content && content.addEventListener('contextmenu', e => {
    e.preventDefault();
    showToast();
  });

  // 6) اعتراض حدث النسخ نفسه (لأي طريقة أخرى)
  content && content.addEventListener('copy', e => {
    e.preventDefault();
    showToast();
  });

})();
