// Data Konstanta Jawa
const PASARAN = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'];
const NEPTU_HARI = [5, 4, 3, 7, 8, 6, 9]; // Min, Sen, Sel, Rab, Kam, Jum, Sab
const NEPTU_PASARAN = [4, 8, 5, 9, 7]; // Wage, Kliwon, Legi, Pahing, Pon
const WUKU = ['Sinta', 'Landep', 'Wukir', 'Kurantil', 'Tolu', 'Gumbreg', 'Warigalit', 'Warigagung', 'Julungwangi', 'Sungsang', 'Galungan', 'Kuningan', 'Langkir', 'Mandasiya', 'Julungpujut', 'Pahang', 'Kuruwelut', 'Marakeh', 'Tambir', 'Medangkungan', 'Maktal', 'Wuye', 'Manahil', 'Prangbakat', 'Bala', 'Wugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung'];

// Data Pepatah
const QUOTES = [
    "Becik ketitik, ala ketara. (Yang baik dan yang buruk akan terlihat pada waktunya)",
    "Alon-alon asal kelakon. (Biar lambat asal selamat)",
    "Sapa nandur, bakale ngunduh. (Siapa menanam, akan menuai)",
    "Sepi ing pamrih, rame ing gawe. (Bekerja keras tanpa pamrih)",
    "Gemi, setiti, ngati-ati. (Hemat, teliti, dan berhati-hati)"
];

// Data Hari Libur Nasional (Simulasi/Contoh)
const HOLIDAYS = {
    "1-1": "Tahun Baru Masehi",
    "17-8": "Hari Kemerdekaan RI",
    "25-12": "Hari Raya Natal"
    // Tambahkan manual sesuai SKB 3 Menteri tahun berjalan
};

let currentDate = new Date();
let selectedDate = new Date();

// DOM Elements
const monthYearDisplay = document.getElementById('month-year-display');
const calendarBody = document.getElementById('calendar-body');
const themeToggle = document.getElementById('theme-toggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    updateClock();
    setInterval(updateClock, 1000);
    setRandomQuote();
    updateSidebar(new Date());
    loadNote(new Date());
});

// Realtime Clock
function updateClock() {
    const now = new Date();
    document.getElementById('realtime-clock').textContent = 
        now.toLocaleTimeString('id-ID', { hour12: false });
}

// Kalender Jawa Logic
function getJawaDetail(date) {
    // Epoch JS: 1 Jan 1970 adalah Kamis Wage
    const epoch = new Date(1970, 0, 1);
    const diffTime = date.getTime() - epoch.getTime();
    // Gunakan Math.floor dan pastikan penanganan timezone lokal
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Pasaran Offset (1 Jan 1970 = Wage = index 0)
    let pasaranIndex = diffDays % 5;
    if (pasaranIndex < 0) pasaranIndex += 5;

    // Hari Index (0 = Minggu)
    const hariIndex = date.getDay();

    // Wuku Offset (1 Jan 1970 = Sungsang = index 9)
    let wukuDays = diffDays + 63; // Offset agar sinkron ke Sinta
    let wukuIndex = Math.floor(wukuDays / 7) % 30;
    if (wukuIndex < 0) wukuIndex += 30;

    const neptu = NEPTU_HARI[hariIndex] + NEPTU_PASARAN[pasaranIndex];

    return {
        pasaran: PASARAN[pasaranIndex],
        wuku: WUKU[wukuIndex],
        neptu: neptu
    };
}

// Format Hijriyah
function // Format Hijriyah (Diperbaiki)
function getHijriyahFormat(date) {
    // Gunakan en-US agar browser memberikan angka murni yang tidak salah diterjemahkan
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        day: 'numeric', month: 'numeric', year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    let hDay, hMonth, hYear;

    parts.forEach(part => {
        if (part.type === 'day') hDay = part.value;
        if (part.type === 'month') hMonth = parseInt(part.value, 10) - 1; // Dikurangi 1 untuk index array (0-11)
        if (part.type === 'year') hYear = parseInt(part.value, 10); // Parse agar teks ekstra seperti 'AH' hilang
    });

    // Array nama bulan Hijriyah standar Indonesia
    const bulanHijriyah = [
        "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", 
        "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", 
        "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
    ];

    // Hasil format: "9 Dzulhijjah 1447 H"
    return `${hDay} ${bulanHijriyah[hMonth]} ${hYear} H`;
}
 {
    return new Intl.DateTimeFormat('id-u-ca-islamic', {
        day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
}

// Render Kalender
function renderCalendar() {
    calendarBody.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const today = new Date();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('date-cell', 'empty');
        calendarBody.appendChild(emptyCell);
    }

    // Days cells
    for (let i = 1; i <= daysInMonth; i++) {
        const cellDate = new Date(year, month, i);
        const cell = document.createElement('div');
        cell.classList.add('date-cell');
        
        const jawa = getJawaDetail(cellDate);
        const dateKey = `${i}-${month + 1}`;
        const isLibur = HOLIDAYS[dateKey] || cellDate.getDay() === 0;

        if (isLibur) cell.classList.add('libur');
        
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            cell.classList.add('selected');
        }

        cell.innerHTML = `
            <span class="masehi-num">${i}</span>
            <span class="jawa-text">${jawa.pasaran}</span>
            ${HOLIDAYS[dateKey] ? '<div class="event-dot"></div>' : ''}
        `;

        cell.addEventListener('click', () => {
            selectedDate = new Date(year, month, i);
            renderCalendar(); // Re-render for selection style
            updateSidebar(selectedDate);
            loadNote(selectedDate);
        });

        calendarBody.appendChild(cell);
    }
}

// Update Sidebar Details
function updateSidebar(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('detail-masehi').textContent = date.toLocaleDateString('id-ID', options);
    
    document.getElementById('detail-hijriyah').textContent = getHijriyahFormat(date);
    
    const jawa = getJawaDetail(date);
    document.getElementById('detail-jawa').textContent = `Pasaran: ${jawa.pasaran}`;
    document.getElementById('detail-wuku').textContent = `Wuku: ${jawa.wuku}`;
    document.getElementById('detail-neptu').textContent = `Neptu: ${jawa.neptu}`;
    
    document.getElementById('note-date-label').textContent = `(${date.getDate()}/${date.getMonth()+1})`;
}

// Catatan (Local Storage)
const noteInput = document.getElementById('note-input');
document.getElementById('save-note').addEventListener('click', () => {
    const dateKey = `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`;
    localStorage.setItem(`note_${dateKey}`, noteInput.value);
    alert('Catatan berhasil disimpan!');
});

function loadNote(date) {
    const dateKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    noteInput.value = localStorage.getItem(`note_${dateKey}`) || '';
}

// Navigation
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('btn-today').addEventListener('click', () => {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    updateSidebar(selectedDate);
    loadNote(selectedDate);
});

// Theme & Quotes
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    document.getElementById('daily-quote').textContent = `"${QUOTES[randomIndex]}"`;
}
