document.addEventListener('DOMContentLoaded', async function() {
    const bookContent = document.getElementById('book-content');
    
    try {
        // Get book ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');
        
        if (!bookId) throw new Error("معرف الكتاب غير موجود");
        
        // Fetch book data
        const response = await fetch('data/books.json');
        if (!response.ok) throw new Error("Network response was not ok");
        
        const books = await response.json();
        const book = books.find(b => b.Serial == bookId);
        
        if (!book) throw new Error("الكتاب غير موجود");
        
        // Display book details
        bookContent.innerHTML = `
            <div class="book-header">
                <div class="book-cover-large">
                    <i class="fas fa-book"></i>
                </div>
                <div class="book-main-info">
                    <h1 class="book-title">${book.Title || 'بدون عنوان'}</h1>
                    <div class="book-author">تأليف: ${book.Author || 'غير معروف'}</div>
                    
                    <div class="book-meta-details">
                        <div class="book-meta-item">
                            <span class="book-meta-label">الناشر:</span>
                            <span>${book.Publisher || 'غير معروف'}</span>
                        </div>
                        <div class="book-meta-item">
                            <span class="book-meta-label">التصنيف:</span>
                            <span>${getCategoryName(book.Dewey)}</span>
                        </div>
                        <div class="book-meta-item">
                            <span class="book-meta-label">تصنيف ديوي:</span>
                            <span>${book.Dewey || 'غير مصنف'}</span>
                        </div>
                        ${book.Year ? `
                        <div class="book-meta-item">
                            <span class="book-meta-label">سنة النشر:</span>
                            <span>${book.Year}</span>
                        </div>` : ''}
                    </div>
                    
                    <a href="#" class="download-btn">
                        <i class="fas fa-download"></i> تحميل الكتاب
                    </a>
                </div>
            </div>
            
            <div class="book-summary">
                <h2>ملخص الكتاب</h2>
                <p>${book.Summary || 'لا يوجد ملخص متوفر حالياً.'}</p>
            </div>
            
            <div class="signature">
                <i class="fas fa-feather"></i>
                مكتبة مدرسة الصريح الثانوية الشاملة للبنات<br>
                بإشراف: المعلمة أسماء الحوراني
            </div>
        `;
        
        // Add download functionality
        document.querySelector('.download-btn').addEventListener('click', function(e) {
            e.preventDefault();
            alert('سيبدأ تحميل الكتاب قريباً');
        });
        
    } catch (error) {
        bookContent.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i