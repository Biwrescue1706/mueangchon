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
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        // สร้าง token จาก username เข้ารหัส base64
        const token = btoa(username);
        document.cookie = `token=${token}; path=/; max-age=${60}`;
        window.location.href = 'index.html';
      });

<<<<<<< HEAD
      // ใช้ username เข้ารหัส base64 เป็น token
      const token = btoa(username);

      // เก็บใน cookie อายุ 10 นาที
      document.cookie = `token=${token}; path=/; max-age=${60 * 10}`;

      window.location.href = 'index.html';
=======
>>>>>>> 87e498c9e88dd6a6f8012ba803a20e23953c5919
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Username หรือ Password ไม่ถูกต้อง',
        showConfirmButton: true
      });
    }

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message
    });
  }
});