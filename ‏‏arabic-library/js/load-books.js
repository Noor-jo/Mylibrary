// Load books from JSON
async function loadBooks() {
  try {
    const response = await fetch('../data/books.json');
    const books = await response.json();
    
    const container = document.getElementById('books-container');
    container.innerHTML = ''; // Clear loading message
    
document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const books = document.querySelectorAll('.book-card');
  
  books.forEach(book => {
    const title = book.querySelector('h3').textContent.toLowerCase();
    book.style.display = title.includes(query) ? 'block' : 'none';
  });
});

    books.forEach(book => {
      container.innerHTML += `
        <div class="book-card" dir="rtl">
          <div class="serial">${book.Serial}</div>
          <h3>${book.Title}</h3>
          <p><strong>المؤلف:</strong> ${book.Author}</p>
          <p><strong>الناشر:</strong> ${book.Publisher}</p>
        </div>
      `;
    });
    
  } catch (error) {
    console.error("Error loading books:", error);
    document.getElementById('books-container').innerHTML = `
      <p class="error">⚠️ تعذر تحميل الكتب. الرجاء المحاولة لاحقاً.</p>
    `;
  }
}

// Run when page loads
window.addEventListener('DOMContentLoaded', loadBooks);