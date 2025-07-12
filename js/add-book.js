const SHEETDB_API = 'https://sheetdb.io/api/v1/e2bc8d71li1qz?sheet=Books';

// สร้าง BooksId ตามปีงบประมาณ (1 ต.ค. - 30 ก.ย.)
async function generateBooksId() {
  const today = new Date();
  const yearBE = today.getFullYear() + 543; // ปี พ.ศ.

  let fiscalYear;
  if (today.getMonth() + 1 >= 10) {
    // เดือน ต.ค. - ธ.ค. ให้ปีงบประมาณ = ปีนี้ + 1
    fiscalYear = yearBE + 1;
  } else {
    // เดือน ม.ค. - ก.ย. ให้ปีงบประมาณ = ปีนี้
    fiscalYear = yearBE;
  }

  // ดึงข้อมูลหนังสือทั้งหมด
  const res = await fetch(SHEETDB_API);
  if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');
  const data = await res.json();

  // หา BooksId ของปีงบประมาณนี้และหาค่าสูงสุด
  const idsThisYear = data
    .map(book => book.BooksId || '')
    .filter(id => id.endsWith(`/${fiscalYear}`))
    .map(id => parseInt(id.split('/')[0], 10))
    .filter(num => !isNaN(num));

  const maxId = idsThisYear.length > 0 ? Math.max(...idsThisYear) : 0;
  const nextId = (maxId + 1).toString().padStart(3, '0');

  return `${nextId}/${fiscalYear}`;
}

document.getElementById('addBookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const book_no = form.book_no.value.trim();
  const date = form.date.value;
  const from = form.from.value.trim();
  const title = form.title.value.trim();
  const note = form.note.value.trim();

  // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const workDate = `${yyyy}-${mm}-${dd}`;

  try {
    const booksId = await generateBooksId();

    const data = {
      BooksId: booksId,
      BookNo: book_no,
      date: date,
      from: from,
      to: "ผกก",
      Title: title,
      Work: workDate,
      note: note
    };

    const res = await fetch(SHEETDB_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [data] })
    });

    if (res.ok) {
      alert('เพิ่มหนังสือสำเร็จ เลขรับ: ' + booksId);
      form.reset();
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
});
