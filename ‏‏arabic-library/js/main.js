// Shared functions across all pages

// Arabic text normalization
function normalizeArabic(text) {
  return text
    .replace(/[أإآء]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/\s+/g, ' ');
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', function() {
      document.querySelector('nav ul').classList.toggle('show');
    });
  }
});