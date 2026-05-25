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

// Data Hari Libur Nasional (Simulasi)
const HOLIDAYS = {
    "1-1": "Tahun Baru Masehi",
    "17-8": "Hari Kemerdekaan RI",
    "25-12": "Hari Raya Natal"
};

let currentDate = new Date();
let selectedDate = new Date();

// DOM Elements
let monthYearDisplay, calendarBody, themeToggle, noteInput;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Ikat elemen DOM secara aman
    monthYearDisplay = document.getElementById('month-year-display');
    calendarBody = document.getElementById('calendar-body');
    themeToggle = document.getElementById('theme-toggle');
    noteInput = document.getElementById('note-input');

    if (calendarBody) {
        renderCalendar();
        updateClock();
        setInterval(updateClock, 1000);
        setRandomQuote();
        updateSidebar(new Date());
        loadNote(new Date());
        setupEventListeners();
    }
});

// Realtime Clock
function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('realtime-clock');
    if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    }
}

// Kalender Jawa Logic
function getJawaDetail(date) {
    const epoch = new Date(1970, 0, 1);
    const diffTime = date.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    let pasaranIndex = diffDays % 5;
    if (pasaranIndex < 0) pasaranIndex += 5;

    const hariIndex = date.getDay();

    let wukuDays = diffDays + 63; 
    let wukuIndex = Math.floor(wukuDays / 7) % 30;
    if (wukuIndex < 0) wukuIndex += 30;

    const neptu = NEPTU_HARI[hariIndex] + NEPTU_PASARAN[pasaranIndex];

    return {
        pasaran: PASARAN[pasaranIndex],
        wuku: WUKU[wukuIndex],
        neptu: neptu
    };
}

// Format Hijriyah (Diperbaiki & Aman dari Error Browser Mobile)
function getHijriyahFormat(date) {
    try {
        const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
            day: 'numeric', month: 'numeric', year: 'numeric'
        });
        
        const parts = formatter.formatToParts(date);
        let hDay = 1, hMonth = 0, hYear = 1447;

        parts.forEach(part => {
            if (part.type === 'day') hDay = part.value;
            if (part.type === 'month') hMonth = parseInt(part.value, 10) - 1; 
            if (part.type === 'year') hYear = parseInt(part.value, 10);
        });

        const bulanHijriyah = [
            "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", 
            "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", 
            "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
        ];

        if (hMonth < 0 || hMonth > 11) hMonth = 0;

        return `${hDay} ${bulanHijriyah[hMonth]} ${hYear} H`;
    } catch (e) {
        return "Gagal memuat tanggal Hijriyah";
    }
}

// Render Kalender
function renderCalendar() {
    if (!calendarBody) return;
    calendarBody.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    if (monthYearDisplay) monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('date-cell', 'empty');
        calendarBody.appendChild(emptyCell);
    }

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
            renderCalendar(); 
            updateSidebar(selectedDate);
            loadNote(selectedDate);
        });

        calendarBody.appendChild(cell);
    }
}

// Update Sidebar Details
function updateSidebar(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const masehiEl = document.getElementById('detail-masehi');
    if (masehiEl) masehiEl.textContent = date.toLocaleDateString('id-ID', options);
    
    const hijriyahEl = document.getElementById('detail-hijriyah');
    if (hijriyahEl) hijriyahEl.textContent = getHijriyahFormat(date);
    
    const jawa = getJawaDetail(date);
    const jawaEl = document.getElementById('detail-jawa');
    if (jawaEl) jawaEl.textContent = `Pasaran: ${jawa.pasaran}`;
    
    const wukuEl = document.getElementById('detail-wuku');
    if (wukuEl) wukuEl.textContent = `Wuku: ${jawa.wuku}`;
    
    const neptuEl = document.getElementById('detail-neptu');
    if (neptuEl) neptuEl.textContent = `Neptu: ${jawa.neptu}`;
    
    const labelEl = document.getElementById('note-date-label');
    if (labelEl) labelEl.textContent = `(${date.getDate()}/${date.getMonth()+1})`;
}

function loadNote(date) {
    if (!noteInput) return;
    const dateKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    noteInput.value = localStorage.getItem(`note_${dateKey}`) || '';
}

function setRandomQuote() {
    const quoteEl = document.getElementById('daily-quote');
    if (quoteEl) {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        quoteEl.textContent = `"${QUOTES[randomIndex]}"`;
    }
}

function setupEventListeners() {
    const prevBtn = document.getElementById('prev-month');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    const nextBtn = document.getElementById('next-month');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    const todayBtn = document.getElementById('btn-today');
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            selectedDate = new Date();
            renderCalendar();
            updateSidebar(selectedDate);
            loadNote(selectedDate);
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('dark-mode')) {
                    icon.classList.replace('fa-moon', 'fa-sun');
                } else {
                    icon.classList.replace('fa-sun', 'fa-moon');
                }
            }
        });
    }

    const saveNoteBtn = document.getElementById('save-note');
    if (saveNoteBtn && noteInput) {
        saveNoteBtn.addEventListener('click', () => {
            const dateKey = `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`;
            localStorage.setItem(`note_${dateKey}`, noteInput.value);
            alert('Catatan berhasil disimpan!');
        });
    }
}
