const SHEETDB_BOOKS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz?sheet=Books'; // URL ของชีตรับหนังสือ

document.getElementById('addBookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookNo = e.target.book_no.value.trim();
  const title = e.target.title.value.trim();

  const data = {
    data: [{
      BookNo: bookNo,
      Title: title
    }]
  };

  try {
    const res = await fetch(SHEETDB_BOOKS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('เพิ่มหนังสือสำเร็จ!');
      e.target.reset();
    } else {
      alert('เพิ่มหนังสือไม่สำเร็จ');
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
});