// index.js

const API_BASE = 'https://mueangchon1.onrender.com'; // เปลี่ยนเป็น backend ของคุณ

const namesUl = document.getElementById("names-ul");
const booksUl = document.getElementById("books-ul");
const searchInput = document.getElementById("search-input");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

let allBooks = [];

/**
 * เรียก API โหลด users
 */
async function loadUsers() {
  try {
    loadingDiv.style.display = "block";
    errorDiv.textContent = "";

    const res = await fetch(`${API_BASE}/users`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('โหลด users ไม่ได้');

    const users = await res.json();
    namesUl.innerHTML = "";

    Object.values(users).forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.Name} (${user.Username})`;
      namesUl.appendChild(li);
    });

  } catch (err) {
    console.error('[loadUsers]', err);
    errorDiv.textContent = `โหลด users ผิดพลาด: ${err.message}`;
  } finally {
    loadingDiv.style.display = "none";
  }
}

/**
 * เรียก API โหลด books
 */
async function loadBooks() {
  try {
    loadingDiv.style.display = "block";
    errorDiv.textContent = "";

    const res = await fetch(`${API_BASE}/books`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('โหลด books ไม่ได้');

    const books = await res.json();
    allBooks = Object.values(books || {});
    renderBooks(allBooks);

  } catch (err) {
    console.error('[loadBooks]', err);
    errorDiv.textContent = `โหลด books ผิดพลาด: ${err.message}`;
  } finally {
    loadingDiv.style.display = "none";
  }
}

/**
 * แสดง books list
 */
function renderBooks(books) {
  booksUl.innerHTML = "";
  if (books.length === 0) {
    booksUl.innerHTML = "<li>ไม่พบหนังสือ</li>";
    return;
  }
  books.forEach(book => {
    const li = document.createElement("li");
    li.textContent = `${book.BookNo || ''} - ${book.Title || ''} (${book.date || ''})`;
    booksUl.appendChild(li);
  });
}

/**
 * ฟิลเตอร์ค้นหา
 */
function searchBooks(keyword) {
  if (!keyword) {
    renderBooks(allBooks);
    return;
  }
  const filtered = allBooks.filter(book =>
    (book.Title && book.Title.toLowerCase().includes(keyword.toLowerCase())) ||
    (book.BookNo && book.BookNo.toLowerCase().includes(keyword.toLowerCase()))
  );
  renderBooks(filtered);
}

searchInput.addEventListener("input", e => {
  searchBooks(e.target.value);
});

/**
 * เรียก checkLogin() จาก auth.js
 * ถ้า login OK => โหลด Users + Books
 * ถ้าไม่ OK => redirect ไป login.html
 */
checkLogin().then(isLoggedIn => {
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  } else {
    loadUsers();
    loadBooks();
  }
});
