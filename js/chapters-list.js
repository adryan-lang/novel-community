// js/chapters-list.js
;(function(){
  /**
   * مولد مصفوفة روابط الفصول بصيغة:
   *   ['prefix/chapter1.html', 'prefix/chapter2.html', ...]
   * @param {string} prefix مسار المجلد (بدون / في البداية أو النهاية)
   * @param {number} count عدد الفصول
   * @returns {string[]} مصفوفة بروابط الفصول
   */
  function generateChapters(prefix, count) {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(`${prefix}/chapter${i}.html`);
    }
    return arr;
  }

  // خريطة جميع الروايات: مفتاحها اسم ملف الـ HTML الرئيسي، وقيمتها مصفوفة فصولها
  const allChapters = {
    'novel1.html': generateChapters('chapters', 84),        // 80 فصلاً في مجلد chapters/
    'novel2.html': generateChapters('novel2_chapters', 70), // 70 فصلاً في مجلد novel2_chapters/
   // 60 فصلاً في مجلد novel4_chapter/
  };

  // استخراج اسم الصفحة الحالي (اسم ملف الـ HTML)
  const currentPage = window.location.pathname.split('/').pop();
  // تعيين window.CHAPTERS لقائمة الفصول الخاصة بالصفحة الحالية
  window.CHAPTERS = allChapters[currentPage] || [];
})();
