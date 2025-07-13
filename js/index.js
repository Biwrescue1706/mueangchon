// สมมติคุณใช้ Firebase SDK v9+ แบบ Modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "BGJ0u3GsrHJCKGRIik4LQtJ3ah89yJAL3ucsoB2PosS3Sb7oECqrP0_udGiynxK5KB9v79aSrfL74zG_UF4XyJA",
  authDomain: "mueangchonburi-c9438.firebaseapp.com",
  projectId: "mueangchonburi-c9438",
  storageBucket: "mueangchonburi-c9438.appspot.com",
  messagingSenderId: "940309310589",
  appId: "1:940309310589:web:950a5fdf0626de417f5514"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const namesUl = document.getElementById("names-ul");
const booksUl = document.getElementById("books-ul");
const searchInput = document.getElementById("search-input");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

function logout() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}
window.logout = logout;  // เพื่อให้เรียกจาก onclick ใน html ได้

async function loadUsers() {
  try {
    loadingDiv.style.display = "block";
    const usersCol = collection(db, "users"); // สมมติ collection ชื่อ users
    const snapshot = await getDocs(usersCol);
    namesUl.innerHTML = "";
    snapshot.forEach(doc => {
      const user = doc.data();
      const li = document.createElement("li");
      li.textContent = user.name || user.email || "ไม่ระบุชื่อ";
      namesUl.appendChild(li);
    });
  } catch (e) {
    errorDiv.textContent = "โหลดรายชื่อผู้ใช้ผิดพลาด: " + e.message;
  } finally {
    loadingDiv.style.display = "none";
  }
}

async function searchBooks(keyword) {
  if (!keyword) {
    booksUl.innerHTML = "";
    return;
  }
  try {
    loadingDiv.style.display = "block";
    booksUl.innerHTML = "";
    // สมมติ collection ชื่อ books และค้นหาจากฟิลด์ subject
    const booksCol = collection(db, "books");
    // ใช้ query where กับการค้นหาที่เหมาะสม (Firebase Firestore ไม่มี contains, อาจใช้ indexing หรือแก้ logic)
    // ตัวอย่างนี้คือ fetch ทั้งหมดแล้ว filter ใน client (ไม่เหมาะกับข้อมูลใหญ่)
    const snapshot = await getDocs(booksCol);
    const results = [];
    snapshot.forEach(doc => {
      const book = doc.data();
      if ((book.subject && book.subject.toLowerCase().includes(keyword.toLowerCase())) ||
          (book.docNumber && book.docNumber.toLowerCase().includes(keyword.toLowerCase()))) {
        results.push(book);
      }
    });

    if (results.length === 0) {
      booksUl.innerHTML = "<li>ไม่พบข้อมูลหนังสือ</li>";
    } else {
      results.forEach(book => {
        const li = document.createElement("li");
        li.textContent = `${book.docNumber || ""} - ${book.subject || ""} (${book.receiveDate || ""})`;
        booksUl.appendChild(li);
      });
    }
  } catch (e) {
    errorDiv.textContent = "ค้นหาหนังสือผิดพลาด: " + e.message;
  } finally {
    loadingDiv.style.display = "none";
  }
}

searchInput.addEventListener("input", (e) => {
  searchBooks(e.target.value);
});

// ตรวจสอบ login ก่อนโหลดข้อมูล
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadUsers();
  }
});
