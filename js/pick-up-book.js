// pick-up-book.js

const API_BASE = 'https://mueangchon1.onrender.com'; // เปลี่ยนตาม backend ของคุณ

const form = document.getElementById('addBookForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const book_no = form.book_no.value.trim();
  const date = form.date.value;
  const from = form.from.value.trim();
  const title = form.title.value.trim();
  const note = form.note.value.trim();

  if (!book_no || !date || !from || !title) {
    Swal.fire({
      icon: 'warning',
      title: 'ข้อมูลไม่ครบถ้วน',
      text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ',
    });
    return;
  }

  const bookData = {
    BookNo: book_no,
    date,
    from,
    to: 'ผกก',
    Title: title,
    note
  };

  try {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'เพิ่มหนังสือไม่สำเร็จ',
        text: errorData.error || res.statusText,
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: 'เพิ่มหนังสือเรียบร้อยแล้ว',
    });

    form.reset();

  } catch (error) {
    console.error('เพิ่มหนังสือผิดพลาด:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเพิ่มหนังสือได้ในขณะนี้',
    });
  }
});
