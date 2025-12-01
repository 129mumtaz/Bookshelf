
        // Konstanta untuk localStorage key
        const STORAGE_KEY = "books";

        // DOM Elements
        const inputBookForm = document.getElementById('inputBook');
        const searchBookForm = document.getElementById('searchBook');
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');
        const editModal = document.getElementById('editModal');
        const editBookForm = document.getElementById('editBookForm');
        const cancelEditButton = document.getElementById('cancelEdit');

        // Load books from localStorage when page loads
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof(Storage) === 'undefined') {
                alert('Browser yang Anda gunakan tidak mendukung Web Storage');
                return;
            }

            loadBooksFromStorage();
            renderBooks();
        });

        // Load books from localStorage
        function loadBooksFromStorage() {
            const serializedData = localStorage.getItem(STORAGE_KEY);
            let data = JSON.parse(serializedData);
            
            if (data !== null) {
                books = data;
            }
        }

        // Save books to localStorage
        function saveBooksToStorage() {
            const serializedData = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, serializedData);
        }

        // Generate unique ID
        function generateId() {
            return +new Date();
        }

        // Find book index by ID
        function findBookIndex(bookId) {
            return books.findIndex(book => book.id === bookId);
        }

        // Render books to the DOM
        function renderBooks(booksToRender = books) {
            // Clear the book lists
            incompleteBookshelfList.innerHTML = '';
            completeBookshelfList.innerHTML = '';
            
            // Check if there are books to render
            if (booksToRender.length === 0) {
                incompleteBookshelfList.innerHTML = '<div class="empty-message">Tidak ada buku yang belum selesai dibaca</div>';
                completeBookshelfList.innerHTML = '<div class="empty-message">Tidak ada buku yang selesai dibaca</div>';
                return;
            }
            
            // Filter books based on completion status
            const incompleteBooks = booksToRender.filter(book => !book.isComplete);
            const completeBooks = booksToRender.filter(book => book.isComplete);
            
            // Render incomplete books
            if (incompleteBooks.length === 0) {
                incompleteBookshelfList.innerHTML = '<div class="empty-message">Tidak ada buku yang belum selesai dibaca</div>';
            } else {
                incompleteBooks.forEach(book => {
                    incompleteBookshelfList.appendChild(createBookElement(book));
                });
            }
            
            // Render complete books
            if (completeBooks.length === 0) {
                completeBookshelfList.innerHTML = '<div class="empty-message">Tidak ada buku yang selesai dibaca</div>';
            } else {
                completeBooks.forEach(book => {
                    completeBookshelfList.appendChild(createBookElement(book));
                });
            }
        }

        // Create book element
        function createBookElement(book) {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.setAttribute('data-bookid', book.id);
            bookItem.setAttribute('data-testid', 'bookItem');
            
            const bookTitle = document.createElement('h3');
            bookTitle.setAttribute('data-testid', 'bookItemTitle');
            bookTitle.innerText = book.title;
            
            const bookAuthor = document.createElement('p');
            bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
            bookAuthor.innerText = `Penulis: ${book.author}`;
            
            const bookYear = document.createElement('p');
            bookYear.setAttribute('data-testid', 'bookItemYear');
            bookYear.innerText = `Tahun: ${book.year}`;
            
            const actionDiv = document.createElement('div');
            actionDiv.classList.add('action');
            
            const toggleButton = document.createElement('button');
            toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
            toggleButton.classList.add('green');
            toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
            
            const editButton = document.createElement('button');
            editButton.setAttribute('data-testid', 'bookItemEditButton');
            editButton.classList.add('orange');
            editButton.innerText = 'Edit buku';
            
            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
            deleteButton.classList.add('red');
            deleteButton.innerText = 'Hapus buku';
            
            // Add event listeners
            toggleButton.addEventListener('click', function() {
                toggleBookCompletion(book.id);
            });
            
            editButton.addEventListener('click', function() {
                openEditModal(book);
            });
            
            deleteButton.addEventListener('click', function() {
                deleteBook(book.id);
            });
            
            // Append elements
            actionDiv.appendChild(toggleButton);
            actionDiv.appendChild(editButton);
            actionDiv.appendChild(deleteButton);
            
            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(actionDiv);
            
            return bookItem;
        }

        // Add new book
        function addBook(title, author, year, isComplete) {
            const newBook = {
                id: generateId(),
                title: title.trim(),
                author: author.trim(),
                year: parseInt(year),
                isComplete: isComplete
            };
            
            books.push(newBook);
            saveBooksToStorage();
            renderBooks();
        }

        // Toggle book completion status
        function toggleBookCompletion(bookId) {
            const bookIndex = findBookIndex(bookId);
            
            if (bookIndex !== -1) {
                books[bookIndex].isComplete = !books[bookIndex].isComplete;
                saveBooksToStorage();
                renderBooks();
            }
        }

        // Delete book
        function deleteBook(bookId) {
            if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
                const bookIndex = findBookIndex(bookId);
                
                if (bookIndex !== -1) {
                    books.splice(bookIndex, 1);
                    saveBooksToStorage();
                    renderBooks();
                }
            }
        }

        // Open edit modal
        function openEditModal(book) {
            document.getElementById('editBookId').value = book.id;
            document.getElementById('editBookTitle').value = book.title;
            document.getElementById('editBookAuthor').value = book.author;
            document.getElementById('editBookYear').value = book.year;
            document.getElementById('editBookIsComplete').checked = book.isComplete;
            
            editModal.style.display = 'flex';
        }

        // Close edit modal
        function closeEditModal() {
            editModal.style.display = 'none';
        }

        // Update book
        function updateBook(id, title, author, year, isComplete) {
            const bookIndex = findBookIndex(parseInt(id));
            
            if (bookIndex !== -1) {
                books[bookIndex] = {
                    id: parseInt(id),
                    title: title.trim(),
                    author: author.trim(),
                    year: parseInt(year),
                    isComplete: isComplete
                };
                
                saveBooksToStorage();
                renderBooks();
            }
        }

        // Search books
        function searchBooks(keyword) {
            if (!keyword) {
                renderBooks();
                return;
            }
            
            const filteredBooks = books.filter(book => 
                book.title.toLowerCase().includes(keyword.toLowerCase())
            );
            
            renderBooks(filteredBooks);
        }

        // Event listener for form submission (add new book)
        inputBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('inputBookTitle').value;
            const author = document.getElementById('inputBookAuthor').value;
            const year = document.getElementById('inputBookYear').value;
            const isComplete = document.getElementById('inputBookIsComplete').checked;
            
            addBook(title, author, year, isComplete);
            
            // Reset form
            inputBookForm.reset();
        });

        // Event listener for search form
        searchBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const keyword = document.getElementById('searchBookTitle').value;
            searchBooks(keyword);
        });

        // Event listener for edit form submission
        editBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = document.getElementById('editBookId').value;
            const title = document.getElementById('editBookTitle').value;
            const author = document.getElementById('editBookAuthor').value;
            const year = document.getElementById('editBookYear').value;
            const isComplete = document.getElementById('editBookIsComplete').checked;
            
            updateBook(id, title, author, year, isComplete);
            closeEditModal();
        });

        // Event listener for cancel edit button
        cancelEditButton.addEventListener('click', closeEditModal);

        // Close modal when clicking outside of it
        window.addEventListener('click', function(e) {
            if (e.target === editModal) {
                closeEditModal();
            }
        });

        // Initialize books array
        let books = [];
  