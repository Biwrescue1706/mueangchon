const SHEETDB_USERS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;
  const hash = CryptoJS.SHA256(password).toString();

  try {
    const res = await fetch(SHEETDB_USERS);
    if (!res.ok) throw new Error('โหลดข้อมูลไม่ได้');

    const users = await res.json();
    const found = users.find(u => u.Username === username && u.Password === hash);

    if (found) {
      alert('เข้าสู่ระบบสำเร็จ!');

      // ใช้ username เข้ารหัส base64 เป็น token
      const token = btoa(username);

      // เก็บใน cookie อายุ 10 นาที
      document.cookie = `token=${token}; path=/; max-age=${60 * 10}`;

      window.location.href = 'index.html';
    } else {
      alert('Username หรือ Password ไม่ถูกต้อง');
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
});
