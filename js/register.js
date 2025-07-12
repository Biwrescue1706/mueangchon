const SHEETDB_USERS = 'https://sheetdb.io/api/v1/e2bc8d71li1qz'; // แก้เป็น API ของคุณ

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const hash = CryptoJS.SHA256(password).toString();

    const data = {
        data: [{
            Username: username,
            Name: name,
            Email: email,
            Password: hash
        }]
    };

    try {
        const res = await fetch(SHEETDB_USERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const text = await res.text();  // อ่าน response เป็น text

        console.log('Response status:', res.status);
        console.log('Response body:', text);

        if (res.ok) {
            alert('สมัครสมาชิกสำเร็จ!');
            window.location.href = 'login.html';
        } else {
            alert('สมัครสมาชิกล้มเหลว: ' + text);
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาด: ' + err.message);
    }
});
