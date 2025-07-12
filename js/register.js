const SHEETDB_USERS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  const hash = CryptoJS.SHA256(password).toString();
<<<<<<< HEAD

  try {
    // ดึงข้อมูลทั้งหมดจาก SheetDB
    const resUsers = await fetch(SHEETDB_USERS);
    const users = await resUsers.json();

    // หา UserId สูงสุด
    let maxId = 0;
    users.forEach(user => {
      const idNum = parseInt(user.UserId);
      if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
    });
    const newUserId = maxId + 1;

    // วันที่ปัจจุบันแบบ ISO String
    const now = new Date().toISOString();

    const data = {
      data: [{
        UserId: newUserId.toString(),
        Username: username,
        Password: hash,
        Name: name,
        Email: email,
        created_at: now,
        updated_at: now
      }]
    };

    // ส่ง POST
=======

  const data = {
    data: [{
      Username: username,
      Name: name,
      Email: email,
      Password: hash
    }]
  };

  try {
>>>>>>> 87e498c9e88dd6a6f8012ba803a20e23953c5919
    const res = await fetch(SHEETDB_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const text = await res.text();

    console.log('Response status:', res.status);
    console.log('Response body:', text);

    if (res.ok) {
<<<<<<< HEAD
      alert('สมัครสมาชิกสำเร็จ!');
      window.location.href = 'login.html';
    } else {
      alert('สมัครสมาชิกล้มเหลว: ' + text);
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
});
=======
      Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ!',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        window.location.href = 'login.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'สมัครสมาชิกล้มเหลว',
        text: text
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
>>>>>>> 87e498c9e88dd6a6f8012ba803a20e23953c5919
