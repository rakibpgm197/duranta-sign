/* ============================================
   APP.JS — মূল অ্যাপ লজিক, নেভিগেশন, ইভেন্ট
============================================ */

/* ---- PAGE CONFIG ---- */
const PAGES = {
    dashboard: { title:'ড্যাশবোর্ড',        subtitle:'সকল পাওনার সারসংক্ষেপ' },
    customers:  { title:'পাওনাদার তালিকা',   subtitle:'সকল পাওনাদারদের হিসাব' },
    notes:      { title:'নোট ও রিমাইন্ডার',  subtitle:'পরিশোধের সময়সীমা ও নোট' },
    history:    { title:'পরিশোধের ইতিহাস',   subtitle:'সকল লেনদেনের রেকর্ড' },
    reports:    { title:'রিপোর্ট',            subtitle:'বিশ্লেষণ ও সারসংক্ষেপ' },
    settings:   { title:'সেটিংস',            subtitle:'অ্যাপ কনফিগারেশন' },
};

let currentPage = 'dashboard';

function showPage(page) {
    if (!PAGES[page]) return;
    currentPage = page;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    const menuEl = document.querySelector(`.menu-item[data-page="${page}"]`);
    if (menuEl) menuEl.classList.add('active');

    document.getElementById('pageTitle').textContent    = PAGES[page].title;
    document.getElementById('pageSubtitle').textContent = PAGES[page].subtitle;

    closeSidebar();

    if (page === 'dashboard') renderDashboard();
    if (page === 'customers') renderCustomers();
    if (page === 'notes')     renderNotes();
    if (page === 'history')   renderHistory();
    if (page === 'reports')   renderReports();
    if (page === 'settings')  renderSettings();
}

/* ---- SIDEBAR ---- */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlayBg').classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlayBg').classList.remove('open');
}

/* ---- MODAL ---- */
function openModal(id) { document.getElementById(id).classList.add('open'); }

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
}

/* ---- TOAST ---- */
function showToast(type, title, msg = '', duration = 3500) {
    const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

/* ---- DASHBOARD ---- */
function renderDashboard() {
    const customers = Store.customers;
    const history   = Store.history;
    const notes     = Store.notes;

    const totalDebt   = customers.reduce((s,c) => s + c.totalDebt, 0);
    const totalPaid   = customers.reduce((s,c) => s + c.totalPaid, 0);
    const totalRemain = totalDebt - totalPaid;
    const doneCount   = customers.filter(c => c.totalDebt > 0 && c.totalPaid >= c.totalDebt).length;

    /* Stat Cards */
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card blue">
            <div class="stat-icon blue">👥</div>
            <div class="stat-value">${customers.length}</div>
            <div class="stat-label">মোট পাওনাদার</div>
        </div>
        <div class="stat-card red">
            <div class="stat-icon red">💵</div>
            <div class="stat-value" style="font-size:1.3rem;">${fmtMoney(totalDebt)}</div>
            <div class="stat-label">মোট পাওনা</div>
        </div>
        <div class="stat-card green">
            <div class="stat-icon green">✅</div>
            <div class="stat-value" style="font-size:1.3rem;">${fmtMoney(totalPaid)}</div>
            <div class="stat-label">মোট পরিশোধ</div>
        </div>
        <div class="stat-card yellow">
            <div class="stat-icon yellow">⏳</div>
            <div class="stat-value" style="font-size:1.3rem;">${fmtMoney(totalRemain)}</div>
            <div class="stat-label">এখনো বাকি</div>
        </div>
    `;

    /* Top Customers */
    const top = [...customers]
        .filter(c => c.totalDebt > 0)
        .sort((a,b) => (b.totalDebt-b.totalPaid) - (a.totalDebt-a.totalPaid))
        .slice(0, 8);

    const tbody = document.getElementById('dashTableBody');
    tbody.innerHTML = top.length === 0
        ? `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🎉</div><p>সকলে পরিশোধ করেছেন!</p></div></td></tr>`
        : top.map((c,i) => {
            const st  = getStatus(c);
            const rem = c.totalDebt - c.totalPaid;
            return `<tr onclick="openDetailModal('${c.id}')">
                <td><div class="serial-num">${i+1}</div></td>
                <td>
                    <div class="cell-name">${c.name}</div>
                    <div class="cell-phone">${c.phone}</div>
                </td>
                <td class="cell-debt">${fmtMoney(c.totalDebt)}</td>
                <td class="cell-remain">${fmtMoney(rem)}</td>
                <td><span class="badge ${st.badge}">${st.emoji} ${st.text}</span></td>
            </tr>`;
        }).join('');

    /* Recent History */
    const recent = history.slice(0, 6);
    document.getElementById('recentList').innerHTML = recent.length === 0
        ? `<div class="empty-state" style="padding:20px;"><div class="empty-icon" style="font-size:1.8rem;">📭</div><p>কোনো লেনদেন নেই</p></div>`
        : recent.map(h => `
            <div class="recent-item">
                <div>
                    <div class="recent-name">${h.customerName}</div>
                    <div class="recent-time">${h.date}</div>
                </div>
                <div class="recent-amount">+${fmtMoney(h.amount)}</div>
            </div>
        `).join('');

    /* Active Notes */
    const activeNotes = notes.slice(0, 3);
    document.getElementById('dashNotes').innerHTML = activeNotes.length === 0
        ? `<div style="color:var(--text-muted);font-size:0.85rem;padding:10px 0;">কোনো নোট নেই</div>`
        : activeNotes.map(n => {
            const dl = getDeadlineInfo(n.deadline);
            return `<div class="recent-item" style="margin-bottom:8px;cursor:pointer;" onclick="showPage('notes')">
                <div style="flex:1;">
                    <div class="recent-name">${n.title}</div>
                    ${dl ? `<div style="font-size:0.72rem;color:var(--warning);">${dl.text}</div>` : `<div class="recent-time">${n.date}</div>`}
                </div>
                <div style="width:10px;height:10px;border-radius:50%;background:${n.color};flex-shrink:0;"></div>
            </div>`;
        }).join('');
}

/* ---- REPORTS ---- */
function renderReports() {
    const customers = Store.customers;
    const history   = Store.history;

    const totalDebt    = customers.reduce((s,c) => s + c.totalDebt, 0);
    const totalPaid    = customers.reduce((s,c) => s + c.totalPaid, 0);
    const totalRemain  = totalDebt - totalPaid;
    const doneCount    = customers.filter(c => c.totalDebt > 0 && c.totalPaid >= c.totalDebt).length;
    const unpaidCount  = customers.filter(c => c.totalPaid === 0 && c.totalDebt > 0).length;
    const partialCount = customers.filter(c => c.totalPaid > 0 && c.totalPaid < c.totalDebt).length;
    const recoverPct   = totalDebt > 0 ? ((totalPaid / totalDebt) * 100).toFixed(1) : 0;

    const topCustomer = [...customers].sort((a,b) => (b.totalDebt-b.totalPaid)-(a.totalDebt-a.totalPaid))[0];

    document.getElementById('reportsContent').innerHTML = `
        <div class="report-section">
            <h3>💰 আর্থিক সারসংক্ষেপ</h3>
            <div class="report-row"><span class="report-label">মোট পাওনা</span><span class="report-value cell-debt">${fmtMoney(totalDebt)}</span></div>
            <div class="report-row"><span class="report-label">মোট পরিশোধ</span><span class="report-value cell-paid">${fmtMoney(totalPaid)}</span></div>
            <div class="report-row"><span class="report-label">এখনো বাকি</span><span class="report-value cell-remain">${fmtMoney(totalRemain)}</span></div>
            <div class="report-row"><span class="report-label">আদায়ের হার</span><span class="report-value" style="color:var(--primary);">${recoverPct}%</span></div>
        </div>

        <div class="report-section">
            <h3>👥 পাওনাদার বিশ্লেষণ</h3>
            <div class="report-row"><span class="report-label">মোট পাওনাদার</span><span class="report-value">${customers.length} জন</span></div>
            <div class="report-row"><span class="report-label">সম্পূর্ণ পরিশোধ করেছেন</span><span class="report-value cell-paid">${doneCount} জন</span></div>
            <div class="report-row"><span class="report-label">আংশিক পরিশোধ</span><span class="report-value" style="color:var(--warning);">${partialCount} জন</span></div>
            <div class="report-row"><span class="report-label">কোনো পরিশোধ নেই</span><span class="report-value cell-debt">${unpaidCount} জন</span></div>
            <div class="report-row"><span class="report-label">সর্বোচ্চ বাকি</span><span class="report-value cell-remain">${topCustomer ? topCustomer.name : '-'} (${topCustomer ? fmtMoney(topCustomer.totalDebt - topCustomer.totalPaid) : '৳০'})</span></div>
        </div>

        <div class="report-section">
            <h3>📋 লেনদেন সারসংক্ষেপ</h3>
            <div class="report-row"><span class="report-label">মোট লেনদেন</span><span class="report-value">${history.length} টি</span></div>
            <div class="report-row"><span class="report-label">মোট আদায়</span><span class="report-value cell-paid">${fmtMoney(history.reduce((s,h)=>s+h.amount,0))}</span></div>
            <div class="report-row"><span class="report-label">সর্বশেষ লেনদেন</span><span class="report-value">${history[0] ? history[0].customerName + ' — ' + history[0].date : 'নেই'}</span></div>
        </div>

        <div style="margin-top:20px;">
            <div class="section-title" style="margin-bottom:15px;">📊 পরিশোধ না করা শীর্ষ তালিকা</div>
            <div class="table-card">
                <div class="table-wrapper">
                    <table>
                        <thead><tr><th>#</th><th>নাম</th><th>ফোন</th><th>বাকি টাকা</th></tr></thead>
                        <tbody>
                        ${[...customers]
                            .filter(c => c.totalDebt - c.totalPaid > 0)
                            .sort((a,b) => (b.totalDebt-b.totalPaid)-(a.totalDebt-a.totalPaid))
                            .slice(0,10)
                            .map((c,i) => `<tr>
                                <td><div class="serial-num">${i+1}</div></td>
                                <td class="cell-name">${c.name}</td>
                                <td class="cell-phone">${c.phone}</td>
                                <td class="cell-remain">${fmtMoney(c.totalDebt-c.totalPaid)}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

/* ---- SETTINGS ---- */
function renderSettings() {
    const s = Store.settings;
    document.getElementById('settingsContent').innerHTML = `
        <div class="settings-card">
            <h3>🏪 দোকানের তথ্য</h3>
            <div class="settings-row">
                <div><div class="settings-label">দোকানের নাম</div><div class="settings-desc">প্রিন্ট ও রিপোর্টে ব্যবহৃত হবে</div></div>
                <input type="text" class="form-input" style="width:220px;" id="shopNameInput" value="${s.shopName}">
            </div>
        </div>

        <div class="settings-card">
            <h3>💾 ডেটা ম্যানেজমেন্ট</h3>
            <div class="settings-row">
                <div><div class="settings-label">ডেটা এক্সপোর্ট</div><div class="settings-desc">JSON ফরম্যাটে ব্যাকআপ করুন</div></div>
                <button class="btn-primary" onclick="exportData()">📥 এক্সপোর্ট</button>
            </div>
            <div class="settings-row">
                <div><div class="settings-label">ডেটা ইম্পোর্ট</div><div class="settings-desc">JSON ফাইল থেকে রিস্টোর করুন</div></div>
                <label class="btn-secondary" style="cursor:pointer;">
                    📤 ইম্পোর্ট
                    <input type="file" accept=".json" style="display:none;" onchange="importData(event)">
                </label>
            </div>
            <div class="settings-row">
                <div><div class="settings-label">সব ডেটা মুছুন</div><div class="settings-desc">⚠️ এটি সম্পূর্ণ অপরিবর্তনীয়</div></div>
                <button class="btn-danger-sm" onclick="resetAllData()">🗑️ রিসেট</button>
            </div>
        </div>

        <div class="settings-card">
            <h3>ℹ️ অ্যাপ তথ্য</h3>
            <div class="settings-row"><span class="settings-label">ভার্সন</span><span style="color:var(--text-muted)">v1.0.0</span></div>
            <div class="settings-row"><span class="settings-label">তৈরিকারী</span><span style="color:var(--text-muted)">দুরন্ত সাইন পাটগ্রাম</span></div>
            <div class="settings-row"><span class="settings-label">ডেটা সংরক্ষণ</span><span style="color:var(--success)">✅ লোকাল স্টোরেজ</span></div>
        </div>

        <button class="btn-primary" onclick="saveSettings()" style="margin-top:5px;">💾 সেটিংস সংরক্ষণ</button>
    `;
}

function saveSettings() {
    const s = Store.settings;
    s.shopName = document.getElementById('shopNameInput').value.trim() || s.shopName;
    Store.settings = s;
    showToast('success', '✅ সেটিংস সংরক্ষিত', '');
}

/* ---- DATA EXPORT/IMPORT ---- */
function exportData() {
    const data = {
        exportDate: new Date().toISOString(),
        shopName: Store.settings.shopName,
        customers: Store.customers,
        notes: Store.notes,
        history: Store.history,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `duranto-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('success', '📥 এক্সপোর্ট সফল', 'ডেটা ডাউনলোড হয়েছে');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const data = JSON.parse(ev.target.result);
            if (!confirm('বিদ্যমান সব ডেটা মুছে নতুন ডেটা লোড করতে চান?')) return;
            if (data.customers) Store.customers = data.customers;
            if (data.notes)     Store.notes     = data.notes;
            if (data.history)   Store.history   = data.history;
            showToast('success', '📤 ইম্পোর্ট সফল', 'ডেটা লোড হয়েছে');
            showPage(currentPage);
        } catch {
            showToast('error', '❌ ত্রুটি', 'ফাইলটি সঠিক JSON নয়');
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    if (!confirm('⚠️ সকল ডেটা মুছে ফেলতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না!')) return;
    if (!confirm('আপনি কি নিশ্চিত? সব ডেটা চিরতরে হারিয়ে যাবে!')) return;
    localStorage.removeItem('ds_customers');
    localStorage.removeItem('ds_notes');
    localStorage.removeItem('ds_history');
    showToast('info', '🗑️ সব ডেটা মুছে ফেলা হয়েছে', '');
    showPage('dashboard');
}

function exportHistory() {
    const history = Store.history;
    if (history.length === 0) { showToast('warning','⚠️ কোনো ইতিহাস নেই',''); return; }

    let csv = 'নাম,ফোন,পরিমাণ,তারিখ,বাকি,নোট\n';
    history.forEach(h => {
        csv += `"${h.customerName}","${h.phone}","${h.amount}","${h.date}","${h.remaining}","${h.note||''}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', '📥 CSV এক্সপোর্ট সফল', '');
}

function printReport() {
    window.print();
}

/* ---- CUSTOMER DETAIL MODAL ---- */
function openDetailModal(id) {
    const c = Store.customers.find(x => x.id === id);
    if (!c) return;

    const rem  = c.totalDebt - c.totalPaid;
    const p    = pct(c);
    const st   = getStatus(c);

    document.getElementById('detailModalTitle').textContent = '👤 ' + c.name;
    document.getElementById('detailContent').innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar">👤</div>
            <div>
                <div class="detail-name">${c.name}</div>
                <div class="detail-phone">📞 ${c.phone}</div>
                ${c.desc ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">📌 ${c.desc}</div>` : ''}
                <div style="margin-top:6px;"><span class="badge ${st.badge}">${st.emoji} ${st.text}</span></div>
            </div>
        </div>

        <div class="detail-stats">
            <div class="detail-stat">
                <div class="detail-stat-val cell-debt">${fmtMoney(c.totalDebt)}</div>
                <div class="detail-stat-label">মোট পাওনা</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-val cell-paid">${fmtMoney(c.totalPaid)}</div>
                <div class="detail-stat-label">পরিশোধ</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-val cell-remain">${fmtMoney(rem)}</div>
                <div class="detail-stat-label">বাকি</div>
            </div>
        </div>

        <div style="padding:0 24px 16px;">
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">
                <span>অগ্রগতি</span><span>${p}%</span>
            </div>
            <div class="progress-bar" style="height:8px;">
                <div class="progress-fill" style="width:${p}%;"></div>
            </div>
        </div>

        <div class="detail-history">
            <h4>পরিশোধের ইতিহাস (${c.history.length} টি)</h4>
            ${c.history.length === 0
                ? `<div style="color:var(--text-muted);font-size:0.85rem;padding:10px 0;">কোনো পরিশোধের রেকর্ড নেই</div>`
                : [...c.history].reverse().map(h => `
                    <div class="detail-history-item">
                        <div>
                            <div style="font-weight:600;color:var(--success);">+${fmtMoney(h.amount)}</div>
                            ${h.note ? `<div style="font-size:0.75rem;color:var(--text-muted);">${h.note}</div>` : ''}
                        </div>
                        <div style="font-size:0.75rem;color:var(--text-muted);">${h.date}</div>
                    </div>
                `).join('')
            }
        </div>

        <div class="modal-footer">
            ${rem > 0 ? `<button class="btn-confirm" style="flex:1;" onclick="closeModal('detailModal');openPayModal('${c.id}');">💳 পরিশোধ গ্রহণ</button>` : ''}
            <button class="btn-cancel" style="flex:1;" onclick="closeModal('detailModal')">বন্ধ করুন</button>
        </div>
    `;

    openModal('detailModal');
}

/* ---- GLOBAL SEARCH ---- */
function initGlobalSearch() {
    document.getElementById('globalSearch').addEventListener('input', function() {
        const q = this.value.trim();
        if (q.length > 0) {
            showPage('customers');
            window._searchQuery = q;
            renderCustomers();
        } else {
            window._searchQuery = '';
            renderCustomers();
        }
    });
}

/* ---- DATE ---- */
function updateSidebarDate() {
    const el = document.getElementById('sidebarDate');
    if (el) {
        el.textContent = new Date().toLocaleDateString('bn-BD', {
            weekday:'short', day:'2-digit', month:'long', year:'numeric'
        });
    }
}

/* ---- INIT ---- */
function init() {
    /* Sidebar menu */
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
        item.addEventListener('click', () => showPage(item.dataset.page));
    });

    /* Hamburger */
    document.getElementById('hamburgerBtn').addEventListener('click', toggleSidebar);
    document.getElementById('overlayBg').addEventListener('click', closeSidebar);

    /* Modal close buttons */
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    /* Modal overlay click to close */
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });

    /* Escape key */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAllModals();
    });

    /* Quick Add button */
    document.getElementById('quickAddBtn').addEventListener('click', () => {
        document.getElementById('qName').value  = '';
        document.getElementById('qPhone').value = '';
        document.getElementById('qAmount').value = '';
        openModal('quickAddModal');
        setTimeout(() => document.getElementById('qName').focus(), 200);
    });

    /* Global search */
    initGlobalSearch();

    /* Sidebar date */
    updateSidebarDate();
    setInterval(updateSidebarDate, 60000);

    /* Color options in note modal */
    document.getElementById('colorOptions').addEventListener('click', e => {
        const opt = e.target.closest('.color-option');
        if (!opt) return;
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
    });

    /* Form toggle */
    document.getElementById('formToggle').addEventListener('click', () => {
        document.getElementById('addCustomerForm').classList.toggle('collapsed');
    });

    /* Customer filter tabs */
    document.getElementById('customerFilterTabs').addEventListener('click', e => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        document.querySelectorAll('#customerFilterTabs .filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderCustomers();
    });

    /* Note filter tabs */
    document.getElementById('noteFilterTabs').addEventListener('click', e => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        document.querySelectorAll('#noteFilterTabs .filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderNotes();
    });

    /* Set today's date in forms */
    const today = todayISO();
    ['newDate','payDateInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = today;
    });

    /* Quick Add Enter Key */
    ['qName','qPhone','qAmount'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') quickAdd();
        });
    });

    /* Load initial page */
    showPage('dashboard');
}

document.addEventListener('DOMContentLoaded', init);