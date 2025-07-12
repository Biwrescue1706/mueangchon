const SHEETDB_USERS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz';
const API_URL = 'https://sheetdb.io/api/v1/e2bc8d71li1qz?sheet=Books';

const namesUl = document.getElementById('names-ul');
const booksUl = document.getElementById('books-ul');
const searchInput = document.getElementById('search-input');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const logoutBtn = document.getElementById('logout-btn');

let books = [];

// โหลดชื่อ
async function loadNames() {
  try {
    const res = await fetch(SHEETDB_USERS);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    namesUl.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.Name || 'ไม่พบชื่อ';
      namesUl.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    errorDiv.textContent = '❌ ไม่สามารถโหลดชื่อได้';
  }
}

// สร้างรายการหนังสือ
function createBookItem(book) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>เลขรับ :</strong> ${book.BookNo || '-'}<br>
    <strong>เลขที่ :</strong> ${book.BookNo || '-'}<br>
    <strong>วันที่ :</strong> ${book.date || '-'}<br>
    <strong>จาก :</strong> ${book.from || '-'}<br>
    <strong>ถึง :</strong> ${book.to || '-'}<br>
    <strong>เรื่อง :</strong> ${book.Title || 'ไม่มีชื่อ'}<br>
    <strong>ปฎิบัติงาน :</strong> ${book.Work || '-'}<br>
    <strong>หมายเหตุ :</strong> ${book.note || '-'}
  `;
  return li;
}

// แสดงรายการหนังสือ
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

// โหลดหนังสือ
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

// กรองรายการเมื่อค้นหา
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


// เริ่มโหลดข้อมูลตอนเปิดหน้า
window.addEventListener('DOMContentLoaded', () => {
  loadNames();
  loadBooks();
});
