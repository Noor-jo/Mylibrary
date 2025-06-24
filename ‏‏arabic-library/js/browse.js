document.addEventListener('DOMContentLoaded', async function() {
    // Configuration
    const BOOKS_PER_PAGE = 12;
    let currentPage = 1;
    let allBooks = [];
    let filteredBooks = [];

    // DOM Elements
    const booksContainer = document.getElementById('books-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const paginationDiv = document.getElementById('pagination');
    const deweyFilters = document.querySelectorAll('[data-dewey]');

    // Load books from JSON
    async function loadBooks() {
        try {
            const response = await fetch('data/books.json');
            if (!response.ok) throw new Error("Network response was not ok");
            
            allBooks = await response.json();
            filteredBooks = [...allBooks];
            
            displayBooks();
            setupPagination();
            
        } catch (error) {
            console.error("Error loading books:", error);
            booksContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i> 
                    حدث خطأ في تحميل الكتب. يرجى المحاولة لاحقاً
                </div>
            `;
        }
    }

    // Display books with pagination
    function displayBooks() {
        const start = (currentPage - 1) * BOOKS_PER_PAGE;
        const end = start + BOOKS_PER_PAGE;
        const booksToShow = filteredBooks.slice(start, end);
        
        booksContainer.innerHTML = '';
        
        if (booksToShow.length === 0) {
            booksContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-book-open"></i>
                    لا توجد كتب متطابقة مع بحثك
                </div>
            `;
            return;
        }
        
        booksToShow.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <div class="book-cover" onclick="location.href='book.html?id=${book.Serial || ''}'">
                    <i class="fas fa-book"></i>
                </div>
                <div class="book-info">
                    <h3>${book.Title || 'بدون عنوان'}</h3>
                    <p class="book-meta">المؤلف: ${book.Author || 'غير معروف'}</p>
                    <p class="book-meta">الناشر: ${book.Publisher || 'غير معروف'}</p>
                    ${book.Dewey ? `<span class="book-category">${book.Dewey}</span>` : ''}
                </div>
            `;
            booksContainer.appendChild(bookCard);
        });
    }

    // Setup pagination
    function setupPagination() {
        const pageCount = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
        paginationDiv.innerHTML = '';
        
        if (pageCount <= 1) return;
        
        // Previous button
        if (currentPage > 1) {
            const prevBtn = document.createElement('a');
            prevBtn.href = '#';
            prevBtn.textContent = 'السابق';
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage--;
                displayBooks();
                updatePagination();
            });
            paginationDiv.appendChild(prevBtn);
        }
        
        // Page numbers
        for (let i = 1; i <= pageCount; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            if (i === currentPage) pageLink.classList.add('active');
            
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                displayBooks();
                updatePagination();
            });
            
            paginationDiv.appendChild(pageLink);
        }
        
        // Next button
        if (currentPage < pageCount) {
            const nextBtn = document.createElement('a');
            nextBtn.href = '#';
            nextBtn.textContent = 'التالي';
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage++;
                displayBooks();
                updatePagination();
            });
            paginationDiv.appendChild(nextBtn);
        }
    }

    function updatePagination() {
        const links = paginationDiv.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.textContent == currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Search functionality
    function handleSearch() {
        const query = normalizeArabic(searchInput.value.trim().toLowerCase());
        
        filteredBooks = allBooks.filter(book => {
            const title = normalizeArabic(book.Title?.toLowerCase() || '');
            const author = normalizeArabic(book.Author?.toLowerCase() || '');
            return title.includes(query) || author.includes(query);
        });
        
        currentPage = 1;
        displayBooks();
        setupPagination();
    }

    // Dewey filter
    function handleDeweyFilter(deweyCode) {
        filteredBooks = deweyCode 
            ? allBooks.filter(book => book.Dewey?.startsWith(deweyCode))
            : [...allBooks];
        
        currentPage = 1;
        displayBooks();
        setupPagination();
    }

    // Event listeners
    searchInput.addEventListener('input', function() {
        handleSearch();
    });

    searchBtn.addEventListener('click', function() {
        handleSearch();
    });

    deweyFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            handleDeweyFilter(this.dataset.dewey);
        });
    });

    // Initial load
    await loadBooks();
});