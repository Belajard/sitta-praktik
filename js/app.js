// --- DATASET SECTION ---
const dataPengguna = [
  { id: 1, nama: "Rina Wulandari", email: "rina@ut.ac.id", password: "rina123", role: "UPBJJ-UT", lokasi: "UPBJJ Jakarta" },
  { id: 2, nama: "Agus Pranoto", email: "agus@ut.ac.id", password: "agus123", role: "UPBJJ-UT", lokasi: "UPBJJ Makassar" },
  { id: 3, nama: "Siti Marlina", email: "siti@ut.ac.id", password: "siti123", role: "Puslaba", lokasi: "Pusat" },
  { id: 4, nama: "Doni Setiawan", email: "doni@ut.ac.id", password: "doni123", role: "Fakultas", lokasi: "FISIP" },
  { id: 5, nama: "Admin SITTA", email: "admin@ut.ac.id", password: "admin123", role: "Administrator", lokasi: "Pusat" }
];

const dataBahanAjar = [
  { kodeLokasi: "0TMP01", kodeBarang: "ASIP4301", namaBarang: "Pengantar Ilmu Komunikasi", jenisBarang: "BMP", edisi: "2", stok: 548, cover: "/assets/pengantar_komunikasi.jpg" },
  { kodeLokasi: "0JKT01", kodeBarang: "EKMA4216", namaBarang: "Manajemen Keuangan", jenisBarang: "BMP", edisi: "3", stok: 392, cover: "/assets/manajemen_keuangan.jpg" },
  { kodeLokasi: "0SBY02", kodeBarang: "EKMA4310", namaBarang: "Kepemimpinan", jenisBarang: "BMP", edisi: "1", stok: 278, cover: "/assets/kepemimpinan.jpg" },
  { kodeLokasi: "0UPBJJBDG", kodeBarang: "PAUD4401", namaBarang: "Perkembangan Anak Usia Dini", jenisBarang: "BMP", edisi: "4", stok: 204, cover: "/assets/paud_perkembangan.jpeg" }
];

const dataTracking = {
  "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "In Transit",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },      
      { waktu: "2025-08-25 10:12:20", keterangan: "Diteruskan ke Kantor Jakarta Selatan" }
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Delivered",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },      
      { waktu: "2025-08-25 16:30:10", keterangan: "Diteruskan ke Kantor Kota Bandung" },
      { waktu: "2025-08-26 12:15:33", keterangan: "Tiba di Hub: Kota BANDUNG" },
      { waktu: "2025-08-26 15:06:12", keterangan: "Proses antar ke Cimahi" },
      { waktu: "2025-08-26 20:00:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  }
};

// --- UTILS & CORE LOGIC SECTION ---
const UT_Utils = {
    userName: localStorage.getItem('userName') || 'User',
    userRole: localStorage.getItem('userRole') || 'Guest',
    logoUrl: './assets/logo_ut.png',

    initTheme() {
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
        this.updateThemeIcon();
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateThemeIcon();
    },

    updateThemeIcon() {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.innerText = document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        }
    },

    showNotification(message) {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toast-message');
        if (!toast || !msgEl) return;
        msgEl.innerText = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
    },

    toggleNotifications() {
        const box = document.getElementById('notification-box');
        if (box) box.classList.toggle('hidden');
    },

    logout() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userActualRole');
        localStorage.removeItem('userLocation');
        window.location.href = 'index.html?logout=true';
    },

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = "Selamat Malam";
        if (hour < 11) greeting = "Selamat Pagi";
        else if (hour < 15) greeting = "Selamat Siang";
        else if (hour < 19) greeting = "Selamat Sore";
        const el = document.getElementById('greetingText');
        if (el) el.innerText = `${greeting}, ${this.userName}`;
    },

    updateOperationalDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const el = document.getElementById('currentDate');
        if (el) el.innerText = now.toLocaleDateString('id-ID', options);
    },

    setupCommonUI() {
        const initialEl = document.getElementById('userInitial');
        if (initialEl) initialEl.innerText = this.userName.charAt(0).toUpperCase();

        const nameDisplay = document.getElementById('userNameDisplay');
        if (nameDisplay) nameDisplay.innerText = this.userName;

        const roleBadge = document.getElementById('userRoleBadge');
        if (roleBadge) roleBadge.innerText = this.userRole;

        // Auto-hide elements based on role - only Admin sees full menu
        if (this.userRole !== 'Admin') {
            ['nav-stok', 'nav-laporan', 'nav-histori'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
        }
        
        
        document.querySelectorAll('.ut-logo-placeholder').forEach(el => {
            el.innerHTML = `<img src="${this.logoUrl}" alt="Universitas Terbuka" class="w-full h-full object-contain">`;
        });
    },

    initGlobalData(force = false) {
        const CURRENT_VERSION = 'dataset_v2';
        const isOldVersion = localStorage.getItem('ut_data_version') !== CURRENT_VERSION;

        if (force || isOldVersion || !localStorage.getItem('ut_stocks') || localStorage.getItem('ut_stocks') === '[]') {
            const initialStocks = dataBahanAjar.map(b => ({
                foto: b.cover,
                kodeLokasi: b.kodeLokasi,
                kodeBarang: b.kodeBarang,
                code: b.kodeBarang,
                name: b.namaBarang,
                category: b.jenisBarang,
                edisi: b.edisi,
                stock: b.stok
            }));
            localStorage.setItem('ut_stocks', JSON.stringify(initialStocks));
            
            const initialOrders = Object.values(dataTracking).map(t => ({
                id: t.nomorDO,
                doNum: t.nomorDO,
                date: t.tanggalKirim + "T10:00:00Z",
                moduleCode: t.paket,
                moduleName: (dataBahanAjar.find(b => b.kodeBarang === t.paket) || {}).namaBarang || 'Modul UT',
                studentName: t.nama,
                status: t.status,
                qty: 1,
                address: "Alamat Pengiriman Terdaftar"
            }));
            localStorage.setItem('ut_orders', JSON.stringify(initialOrders));
            localStorage.setItem('ut_reports', JSON.stringify([]));
            
            localStorage.setItem('ut_data_version', CURRENT_VERSION);
        }
    }
};

// --- AUTH GATES ---
const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
const isLoggedIn = !!localStorage.getItem('userName');

if (!isLoggedIn && !isLoginPage) {
    window.location.href = 'index.html';
}
if (isLoggedIn && isLoginPage && !window.location.search.includes('logout')) {
    window.location.href = 'dashboard.html';
}

// --- GLOBAL EXPOSURE ---
window.dataPengguna = dataPengguna;
window.dataBahanAjar = dataBahanAjar;
window.dataTrackingMap = dataTracking;
window.UT_Utils = UT_Utils;
window.toggleTheme = () => UT_Utils.toggleTheme();
window.toggleNotifications = () => UT_Utils.toggleNotifications();
window.showNotification = (msg) => UT_Utils.showNotification(msg);
window.clearNotifications = () => {
    const list = document.getElementById('notification-list');
    if (list) list.innerHTML = '<div class="p-8 text-center text-slate-400"><span class="material-symbols-outlined text-4xl mb-2">notifications_off</span><p class="text-xs">Berhasil dikosongkan.</p></div>';
    const badge = document.getElementById('notif-badge');
    if (badge) badge.classList.add('hidden');
};

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    UT_Utils.initGlobalData();
    UT_Utils.initTheme();
    UT_Utils.setupCommonUI();
});
