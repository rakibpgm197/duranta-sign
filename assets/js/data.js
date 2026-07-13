/* ============================================
   DATA.JS — ডেটা স্টোর ও ডিফল্ট কাস্টমার
============================================ */

const DEFAULT_CUSTOMERS = [
    { id:'c1',  name:'মাহবুব ভাই',                phone:'01717094515', totalDebt:900,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c2',  name:'হস্তলিপি একাডেমী',            phone:'01894062946', totalDebt:500,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c3',  name:'Afsana Arifa Apu',           phone:'01616746123', totalDebt:1300,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c4',  name:'Sumaiya F',                  phone:'01704304505', totalDebt:2000,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c5',  name:'Sojib Red crescent',         phone:'01406587807', totalDebt:150,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c6',  name:'Sumon Vai Patgram',           phone:'01976707601', totalDebt:250,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c7',  name:'Hamidul Islám Milon Vai',    phone:'01785314552', totalDebt:900,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c8',  name:"Lemon's English Point",      phone:'01787750815', totalDebt:4000,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c9',  name:'Sagor Vai Pt',               phone:'01781022523', totalDebt:200,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c10', name:'Mostofa Vai New',             phone:'01765030107', totalDebt:1500,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c11', name:'Abdul korim chacha',          phone:'01751120859', totalDebt:800,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c12', name:'Popy dada poster',            phone:'01734559077', totalDebt:1000,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c13', name:'Tasmiya F Patgram',           phone:'01854500402', totalDebt:600,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c14', name:'Shahajalal vai Patgram',      phone:'01737653899', totalDebt:2158,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c15', name:'রেজাউল পানবাড়ি মাদ্রাসা',     phone:'01937365426', totalDebt:1000,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c16', name:'আতিক স্যার সরকারি কলেজ',      phone:'01738236006', totalDebt:2380,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c17', name:'সুমন কুচলিবাড়ি',              phone:'01881047502', totalDebt:800,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c18', name:'ইমানুর',                      phone:'01345851277', totalDebt:1400,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c19', name:'ফরিদুল জয়যাত্রা',             phone:'01792808305', totalDebt:2296,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c20', name:'মনির ভাই জোংড়া',             phone:'01710226756', totalDebt:6000,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c21', name:'মাহবুব হুজুর',                phone:'01723489907', totalDebt:8246,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c22', name:'হাফিজুল হুজুর',               phone:'01301663645', totalDebt:700,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c23', name:'কচুয়ারপাড় উচ্চ বিদ্যালয়',    phone:'01716090586', totalDebt:1500,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c24', name:'ললিতারহাট উচ্চ বিদ্যালয়',    phone:'01309123014', totalDebt:6000,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c25', name:'আনোয়ারুল ইসলাম রাজু',         phone:'01612021855', totalDebt:12340, totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c26', name:'রাকিব',                       phone:'01581887072', totalDebt:100,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c27', name:'Nazmira',                    phone:'01812489130', totalDebt:0,     totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c28', name:'Mamun Vai Icab',             phone:'01774218668', totalDebt:0,     totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c29', name:'ঈমানুর কুচলিবাড়ী',            phone:'01714287824', totalDebt:1370,  totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
    { id:'c30', name:'Mijanur hujur',              phone:'01745099906', totalDebt:500,   totalPaid:0, desc:'', addedDate:'01/07/2026', history:[] },
];

/* ---------- STORE ---------- */
const Store = {
    get customers() {
        const d = localStorage.getItem('ds_customers');
        return d ? JSON.parse(d) : DEFAULT_CUSTOMERS;
    },
    set customers(v) { localStorage.setItem('ds_customers', JSON.stringify(v)); },

    get notes() {
        const d = localStorage.getItem('ds_notes');
        return d ? JSON.parse(d) : [];
    },
    set notes(v) { localStorage.setItem('ds_notes', JSON.stringify(v)); },

    get history() {
        const d = localStorage.getItem('ds_history');
        return d ? JSON.parse(d) : [];
    },
    set history(v) { localStorage.setItem('ds_history', JSON.stringify(v)); },

    get settings() {
        const d = localStorage.getItem('ds_settings');
        return d ? JSON.parse(d) : { shopName: 'দুরন্ত সাইন পাটগ্রাম', currency: '৳', darkMode: true };
    },
    set settings(v) { localStorage.setItem('ds_settings', JSON.stringify(v)); },
};

/* ---------- HELPERS ---------- */
function genId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function fmtMoney(n) {
    if (isNaN(n)) return '৳০';
    return '৳' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('bn-BD', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDateTime() {
    return new Date().toLocaleString('bn-BD', {
        day:'2-digit', month:'short', year:'numeric',
        hour:'2-digit', minute:'2-digit'
    });
}

function getDeadlineInfo(deadline) {
    if (!deadline) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const dl = new Date(deadline);
    const diff = Math.round((dl - today) / 86400000);

    if (diff < 0)  return { cls:'dl-overdue', text:`⚠️ ${Math.abs(diff)} দিন আগে শেষ হয়েছে`, type:'overdue' };
    if (diff === 0) return { cls:'dl-soon',    text:'🔔 আজই শেষ তারিখ',                        type:'soon' };
    if (diff <= 5)  return { cls:'dl-soon',    text:`⏰ ${diff} দিন বাকি`,                       type:'soon' };
    return           { cls:'dl-ok',    text:`📅 ${diff} দিন বাকি`,                       type:'ok' };
}

function getStatus(c) {
    const rem = c.totalDebt - c.totalPaid;
    if (c.totalDebt === 0) return { badge:'badge-muted',    emoji:'➖', text:'পাওনা নেই' };
    if (rem <= 0)           return { badge:'badge-success',  emoji:'✅', text:'সম্পূর্ণ পরিশোধ' };
    if (c.totalPaid > 0)    return { badge:'badge-warning',  emoji:'⏳', text:'আংশিক পরিশোধ' };
    return                         { badge:'badge-danger',   emoji:'❌', text:'পরিশোধ হয়নি' };
}

function pct(c) {
    if (c.totalDebt === 0) return 100;
    return Math.min(100, Math.round((c.totalPaid / c.totalDebt) * 100));
}