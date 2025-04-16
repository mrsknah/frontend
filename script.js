const BASE_URL = "http://localhost:5000";

// Helper: Ambil token dari localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Helper: Set token ke localStorage
function setToken(token) {
  localStorage.setItem("token", token);
}

// Helper: Logout dan redirect ke login
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Helper: Redirect kalau tidak login
function ensureAuthenticated() {
  const token = getToken();
  if (!token) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
  }
}

// Helper: Cek apakah user admin
async function ensureAdmin() {
  const user = await fetchCurrentUser();
  if (user.role !== "admin") {
    alert("Akses ditolak. Halaman ini hanya untuk admin.");
    window.location.href = "profile.html";
  }
  return user;
}

// Ambil data user yang sedang login
async function fetchCurrentUser() {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!res.ok) {
    logout();
  }
  return await res.json();
}

// ---------------------- LOGIN ----------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error("Login gagal");

    const data = await res.json();
    setToken(data.token);
    window.location.href = "profile.html";
  } catch (err) {
    alert("Login gagal. Periksa username dan password.");
  }
});

// ---------------------- REGISTER ----------------------
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value;
  const password = form.password.value;
  const role = form.role?.value || "user";

  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "index.html";
  } catch (err) {
    alert("Gagal registrasi: " + err.message);
  }
});

// ---------------------- LOGOUT ----------------------
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  logout();
});
