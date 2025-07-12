const SHEETDB_USERS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz';
const API_URL = 'https://sheetdb.io/api/v1/e2bc8d71li1qz?sheet=Books';

const namesUl = document.getElementById('names-ul');
const booksUl = document.getElementById('books-ul');
const searchInput = document.getElementById('search-input');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const logoutBtn = document.getElementById('logout-btn');

let books = [];

// === Utils ===

// อ่านค่า cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// ดึง username จาก token แล้ว decode base64
function getUsernameFromToken() {
  const token = getCookie('token');
  if (!token) return null;
  return atob(token);
}

// ลบ cookie
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// === ชื่อผู้ใช้ ===
async function loadNames() {
  try {
    const res = await fetch(SHEETDB_USERS);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const currentUsername = getUsernameFromToken();
    if (!currentUsername) {
      errorDiv.textContent = '❌ ไม่พบ token กรุณาเข้าสู่ระบบใหม่';
      return;
    }

    namesUl.innerHTML = '';

    const matched = data.find(item => item.Username === currentUsername);

    if (matched) {
      const li = document.createElement('li');
      li.textContent = matched.Name || 'ไม่พบชื่อ';
      namesUl.appendChild(li);
    } else {
      namesUl.innerHTML = '<li>ไม่พบชื่อผู้ใช้</li>';
    }
  } catch (err) {
    console.error(err);
    errorDiv.textContent = '❌ ไม่สามารถโหลดชื่อได้';
  }
}

// === หนังสือ ===
async function loadBooks() {
  loadingDiv.style.display = 'block';
  errorDiv.textContent = '';
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    books = data;
    displayBooks(books);
  } catch (err) {
    console.error(err);
    errorDiv.textContent = '❌ ไม่สามารถโหลดหนังสือได้';
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function createBookItem(book) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>เลขรับ :</strong> ${book.BookNo || '-'}<br>
    <strong>เลขที่ :</strong> ${book.BookNo || '-'}<br>
    <strong>วันที่ :</strong> ${book.date || '-'}<br>
    <strong>จาก :</strong> ${book.from || '-'}<br>
    <strong>ถึง :</strong> ${book.to || '-'}<br>
    <strong>เรื่อง :</strong> ${book.Title || 'ไม่มีชื่อ'}<br>
    <strong>ปฏิบัติงาน :</strong> ${book.Work || '-'}<br>
    <strong>หมายเหตุ :</strong> ${book.note || '-'}
  `;
  return li;
}

function displayBooks(list) {
  booksUl.innerHTML = '';
  if (list.length === 0) {
    booksUl.innerHTML = '<li>ไม่พบหนังสือที่ค้นหา</li>';
    return;
  }
  list.forEach(book => {
    const li = createBookItem(book);
    booksUl.appendChild(li);
  });
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = books.filter(book =>
    (book.Title || '').toLowerCase().includes(query) ||
    (book.BookNo || '').toLowerCase().includes(query) ||
    (book.from || '').toLowerCase().includes(query) ||
    (book.to || '').toLowerCase().includes(query) ||
    (book.booksId || '').toLowerCase().includes(query)
  );
  displayBooks(filtered);
});

// === logout ===
logoutBtn.addEventListener('click', () => {
  deleteCookie('token');
  window.location.href = 'login.html';
});

// === โหลด ===
window.addEventListener('DOMContentLoaded', () => {
  loadNames();
  loadBooks();
});
