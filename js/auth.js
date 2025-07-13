function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function checkLogin() {
  const token = getCookie('token');
  if (!token) {
    alert('กรุณาเข้าสู่ระบบก่อน');
    window.location.href = 'login.html';
    return;
  }

  try {
    // decode base64 token เป็น username
    const username = atob(token);
    const role = atob(token);

    // คุณอาจเช็ค username นี้กับรายการ user จาก API หรือ localStorage อีกที
    if (!username) throw new Error('ไม่มีชื่อผู้ใช้');

    console.log('Logged in as:', username);
    console.log('role in as:', role);
    // หรือแสดงชื่อผู้ใช้บนหน้าเว็บ
  } catch (err) {
    alert('Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่');
    window.location.href = 'login.html';
  }
}

function logout() {
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = 'login.html';
}
