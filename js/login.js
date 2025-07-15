document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  if (!username || !password) {
    alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    return;
  }

  try {
    const res = await fetch('https://mueangchon1.onrender.com/login', {
      method: 'POST',
      credentials: 'include',   // สำคัญ! เพื่อให้ cookie ถูกส่งกลับและเก็บใน browser
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      alert(`Error: ${errData.error || res.statusText}`);
      return;
    }

    const data = await res.json();

    alert('เข้าสู่ระบบสำเร็จ!');

    // ทำอย่างอื่น เช่น redirect ไปหน้าอื่น
    window.location.href = '/dashboard.html';

  } catch (error) {
    console.error('Login failed:', error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  }
});
