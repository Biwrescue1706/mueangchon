document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  if (!username || !password) {
    Swal.fire('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    return;
  }

  try {
    const res = await fetch('https://mueangchon1.onrender.com/login', {
      method: 'POST',
      credentials: 'include', // สำคัญ!
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        password 
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errData.error || res.statusText,
      });
      return;
    }

    const data = await res.json();

    await Swal.fire({
      icon: 'success',
      title: 'เข้าสู่ระบบสำเร็จ!',
      text: `ยินดีต้อนรับ ${data.user?.Username || ''}`,
    });

    // เปลี่ยนหน้า
    window.location.href = 'index.html';

  } catch (error) {
    console.error('Login failed:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
    });
  }
});
