document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const role = e.target.role.value.trim();

  if (!username || !password || !name || !email || !role) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
    });
    return;
  }

  try {
    const res = await fetch('https://mueangchon1.onrender.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        name,
        email,
        role
      }),
      credentials: 'include' // ✅ เผื่อในอนาคตมี cookie set
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: data.error || 'สมัครสมาชิกไม่สำเร็จ'
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'สมัครสมาชิกสำเร็จ!',
      text: `ยินดีต้อนรับคุณ ${username}`
    });

    window.location.href = 'login.html'; // ✅ ไปหน้า Login หลังสมัครเสร็จ

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'เชื่อมต่อไม่ได้',
      text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
    });
  }
});
