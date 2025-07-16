// auth.js

const API_BASE = 'https://mueangchon1.onrender.com'; // เปลี่ยนตาม backend ของคุณ

/**
 * ฟังก์ชัน login
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<boolean>} true ถ้าล็อกอินสำเร็จ
 */
async function login(username, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'  // ส่ง cookie รับ cookie ด้วย
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    // login สำเร็จ backend จะเซ็ต cookie jwt ให้แล้ว
    return true;
  } catch (error) {
    console.error('Login error:', error);
    alert(error.message);
    return false;
  }
}

/**
 * ฟังก์ชันเช็คสถานะ login ว่ายัง valid หรือไม่
 * @returns {Promise<boolean>}
 */
async function checkLogin() {
  try {
    const res = await fetch(`${API_BASE}/private-data`, {
      credentials: 'include'
    });

    if (res.ok) {
      // token ยัง valid
      return true;
    } else {
      // token หมดอายุหรือไม่ถูกต้อง
      return false;
    }
  } catch (error) {
    console.error('Check login error:', error);
    return false;
  }
}

/**
 * ฟังก์ชัน logout
 */
async function logout() {
  try {
    const res = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (res.ok) {
      window.location.href = 'login.html';
    } else {
      alert('ออกจากระบบไม่สำเร็จ');
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาดขณะออกจากระบบ');
  }
}

// export ถ้าใช้ module
// export { login, checkLogin, logout };

// หรือถ้าไม่ใช้ module ก็ผูกกับ window เพื่อเรียกจากหน้าอื่นได้
window.login = login;
window.checkLogin = checkLogin;
window.logout = logout;
