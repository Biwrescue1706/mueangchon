const SHEETDB_USERS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz';  // เปลี่ยนเป็น URL ของคุณ

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  const hash = CryptoJS.SHA256(password).toString();

  try {
    const res = await fetch(SHEETDB_USERS);
    if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');

    const users = await res.json();

    const found = users.find(u => u.Username === username && u.Password === hash);

    if (found) {
      alert('เข้าสู่ระบบสำเร็จ!');
      localStorage.setItem('loggedInUser', JSON.stringify(found));
      window.location.href = 'add-book.html';  // เปลี่ยนเป็นหน้าเป้าหมาย
    } else {
      alert('Username หรือ Password ไม่ถูกต้อง');
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  }
});
