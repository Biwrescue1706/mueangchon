// ฟังก์ชันอ่านค่า cookie
function getCookie(name) {
  const cookies = document.cookie.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith(name + '=')) {
      return c.substring(name.length + 1);
    }
  }
  return null;
}

// เช็ค role ถ้าไม่ใช่ 2,7,8 ให้บล็อกและรีไดเรค
(function checkRole() {
  const allowedRoles = ['2', '7', '8']; // role ที่อนุญาต
  const role = getCookie('role');

  if (!role) {
    alert('กรุณาเข้าสู่ระบบก่อน');
    window.location.href = 'login.html';
    return;
  }

  if (!allowedRoles.includes(role)) {
    alert('คุณไม่มีสิทธิ์เข้าหน้านี้');
    window.location.href = 'login.html';
    return;
  }
})();

const SHEETDB_API = 'https://sheetdb.io/api/v1/e2bc8d71li1qz?sheet=Stabbing'; // แก้เป็น API ของคุณ

document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const title = form.title.value.trim();
  const content = form.content ? form.content.value.trim() : ''; // กรณีมี content ในฟอร์ม
  const assignee = form.assignee.value.trim();

  // เก็บค่า checkbox ที่ถูกเลือก
  const departments = [];
  form.querySelectorAll('input[name="departments"]:checked').forEach(cb => {
    departments.push(cb.value);
  });

  if (departments.length === 0) {
    alert('กรุณาเลือกสายงานอย่างน้อย 1 งาน');
    return;
  }

  // อ่านไฟล์ลายเซ็น ถ้ามี
  let signatureUrl = '';
  const file = form.signature.files[0];
  if (file) {
    try {
      signatureUrl = await uploadSignature(file);
    } catch (err) {
      alert('ไม่สามารถอัปโหลดลายเซ็นได้');
      return;
    }
  }

  try {
    // บันทึกข้อมูลแยกตามสายงานที่เลือก
    for (const dept of departments) {
      const data = {
        data: [{
          Title: title,
          Content: content,
          AssignedTo: assignee,
          Department: dept,
          Signature: signatureUrl,
          DeptStatus: 'รอดำเนินการ',
          Created_at: new Date().toISOString()
        }]
      };

      const res = await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('เกิดข้อผิดพลาดขณะบันทึกข้อมูล');
    }

    alert('บันทึกหนังสือเรียบร้อยแล้ว');
    form.reset();

  } catch (error) {
    console.error(error);
    alert('บันทึกข้อมูลไม่สำเร็จ โปรดลองใหม่อีกครั้ง');
  }
});

// ฟังก์ชันอ่านไฟล์ลายเซ็นและแปลงเป็น base64
async function uploadSignature(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
    reader.readAsDataURL(file);
  });
}
