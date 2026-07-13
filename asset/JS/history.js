/* ============================================
   HISTORY.JS — পরিশোধের ইতিহাস
============================================ */

function renderHistory() {
    const history = Store.history;
    const list    = document.getElementById('historyList');
    const empty   = document.getElementById('historyEmpty');
    const stats   = document.getElementById('historyStats');

    const totalAmount = history.reduce((s,h) => s + h.amount, 0);
    const todayAmt    = history.filter(h => h.date === fmtDate(todayISO())).reduce((s,h) => s + h.amount, 0);

    stats.innerHTML = `
        <div class="history-stat">
            <div class="history-stat-val">${history.length}</div>
            <div class="history-stat-label">মোট লেনদেন</div>
        </div>
        <div class="history-stat">
            <div class="history-stat-val" style="color:var(--success);">${fmtMoney(totalAmount)}</div>
            <div class="history-stat-label">মোট আদায়</div>
        </div>
        <div class="history-stat">
            <div class="history-stat-val" style="color:var(--primary);">${fmtMoney(todayAmt)}</div>
            <div class="history-stat-label">আজকের আদায়</div>
        </div>
    `;

    if (history.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';

    list.innerHTML = history.map(h => `
        <div class="history-item">
            <div class="history-dot"></div>
            <div class="history-info">
                <div class="history-name">${h.customerName}</div>
                <div class="history-desc">📞 ${h.phone}${h.note ? ' · 📌 ' + h.note : ''}</div>
            </div>
            <div class="history-right">
                <div class="history-amount">+${fmtMoney(h.amount)}</div>
                <div class="history-time">${h.date}</div>
                <div class="history-remain">বাকি: ${fmtMoney(h.remaining)}</div>
            </div>
        </div>
    `).join('');
}

function clearHistory() {
    if (!confirm('সকল পরিশোধের ইতিহাস মুছে ফেলতে চান?')) return;
    Store.history = [];
    renderHistory();
    showToast('info','🗑️ ইতিহাস মুছে ফেলা হয়েছে','');
}