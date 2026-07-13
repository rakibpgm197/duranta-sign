/* ============================================
   CUSTOMERS.JS — পাওনাদার ম্যানেজমেন্ট
============================================ */

window._searchQuery = '';

/* ---- ADD CUSTOMER ---- */
function addCustomer() {
    const name   = document.getElementById('newName').value.trim();
    const phone  = document.getElementById('newPhone').value.trim();
    const amount = parseFloat(document.getElementById('newAmount').value);
    const date   = document.getElementById('newDate').value || todayISO();
    const desc   = document.getElementById('newDesc').value.trim();

    if (!name)             { showToast('error','⚠️ ত্রুটি','নাম লিখুন!'); return; }
    if (!phone)            { showToast('error','⚠️ ত্রুটি','ফোন নম্বর লিখুন!'); return; }
    if (isNaN(amount)||amount<0) { showToast('error','⚠️ ত্রুটি','সঠিক পরিমাণ লিখুন!'); return; }

    const customers = Store.customers;
    customers.push({
        id: genId('c'),
        name, phone,
        totalDebt: amount,
        totalPaid: 0,
        desc,
        addedDate: fmtDate(date),
        history: []
    });
    Store.customers = customers;

    clearForm();
    renderCustomers();
    renderDashboard();
    updateNoteCustomerSelect();
    showToast('success','✅ সফল!', `${name} যোগ করা হয়েছে`);
}

function quickAdd() {
    const name   = document.getElementById('qName').value.trim();
    const phone  = document.getElementById('qPhone').value.trim();
    const amount = parseFloat(document.getElementById('qAmount').value);

    if (!name)             { showToast('error','⚠️','নাম লিখুন!'); return; }
    if (!phone)            { showToast('error','⚠️','ফোন লিখুন!'); return; }
    if (isNaN(amount)||amount<0) { showToast('error','⚠️','সঠিক পরিমাণ লিখুন!'); return; }

    const customers = Store.customers;
    customers.push({
        id: genId('c'),
        name, phone,
        totalDebt: amount,
        totalPaid: 0,
        desc: '',
        addedDate: fmtDate(todayISO()),
        history: []
    });
    Store.customers = customers;

    closeModal('quickAddModal');
    renderCustomers();
    renderDashboard();
    updateNoteCustomerSelect();
    showToast('success','✅ যোগ হয়েছে!', name);
}

function clearForm() {
    ['newName','newPhone','newAmount','newDesc'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('newDate').value = todayISO();
}

/* ---- RENDER CUSTOMERS ---- */
function renderCustomers() {
    const customers = Store.customers;
    const q         = (window._searchQuery || '').toLowerCase();
    const filter    = (document.querySelector('#customerFilterTabs .filter-tab.active')?.dataset?.filter) || 'all';
    const sort      = document.getElementById('sortSelect')?.value || 'name';

    let list = [...customers];

    /* Search */
    if (q) {
        list = list.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.desc || '').toLowerCase().includes(q)
        );
    }

    /* Filter */
    if (filter === 'unpaid')  list = list.filter(c => c.totalPaid === 0 && c.totalDebt > 0);
    if (filter === 'partial') list = list.filter(c => c.totalPaid > 0 && c.totalPaid < c.totalDebt);
    if (filter === 'done')    list = list.filter(c => c.totalDebt > 0 && c.totalPaid >= c.totalDebt);
    if (filter === 'zero')    list = list.filter(c => c.totalDebt === 0);

    /* Sort */
    if (sort === 'name')        list.sort((a,b) => a.name.localeCompare(b.name, 'bn'));
    if (sort === 'debt-high')   list.sort((a,b) => b.totalDebt - a.totalDebt);
    if (sort === 'debt-low')    list.sort((a,b) => a.totalDebt - b.totalDebt);
    if (sort === 'remain-high') list.sort((a,b) => (b.totalDebt-b.totalPaid) - (a.totalDebt-a.totalPaid));

    const tbody = document.getElementById('customerTableBody');
    const empty = document.getElementById('custEmpty');

    document.getElementById('customerCount').textContent = `${list.length} জন`;

    if (list.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';

    tbody.innerHTML = list.map((c, i) => {
        const rem = c.totalDebt - c.totalPaid;
        const st  = getStatus(c);
        const p   = pct(c);

        return `<tr onclick="openDetailModal('${c.id}')" style="cursor:pointer;">
            <td><div class="serial-num">${i + 1}</div></td>
            <td>
                <div class="cell-name">${c.name}</div>
                <div class="cell-phone">📞 ${c.phone}</div>
            </td>
            <td><div class="cell-desc" title="${c.desc||''}">${c.desc || '—'}</div></td>
            <td class="cell-debt">${fmtMoney(c.totalDebt)}</td>
            <td class="cell-paid">${fmtMoney(c.totalPaid)}</td>
            <td class="cell-remain">${fmtMoney(rem)}</td>
            <td>
                <div class="progress-wrap">
                    <div class="progress-text">${p}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${p}%;"></div>
                    </div>
                </div>
            </td>
            <td><span class="badge ${st.badge}">${st.emoji} ${st.text}</span></td>
            <td onclick="event.stopPropagation();">
                <div class="action-btns">
                    ${rem > 0 ? `<button class="btn-sm btn-pay" onclick="openPayModal('${c.id}')">💳 পরিশোধ</button>` : ''}
                    <button class="btn-sm btn-detail" onclick="openDetailModal('${c.id}')">👁️</button>
                    <button class="btn-sm btn-note-sm" onclick="openNoteModal('${c.id}')">📝</button>
                    <button class="btn-sm btn-del" onclick="deleteCustomer('${c.id}')">🗑️</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function deleteCustomer(id) {
    const customers = Store.customers;
    const c = customers.find(x => x.id === id);
    if (!c) return;
    if (!confirm(`"${c.name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) return;
    Store.customers = customers.filter(x => x.id !== id);
    renderCustomers();
    renderDashboard();
    updateNoteCustomerSelect();
    showToast('info','🗑️ মুছে ফেলা হয়েছে', c.name);
}

/* ---- PAY MODAL ---- */
let _payingId = null;

function openPayModal(id) {
    const c = Store.customers.find(x => x.id === id);
    if (!c) return;
    _payingId = id;
    const rem = c.totalDebt - c.totalPaid;

    document.getElementById('payInfo').innerHTML = `
        <div class="modal-info-row">
            <span class="modal-info-label">👤 নাম</span>
            <span class="modal-info-value">${c.name}</span>
        </div>
        <div class="modal-info-row">
            <span class="modal-info-label">📞 ফোন</span>
            <span class="modal-info-value" style="font-family:monospace;">${c.phone}</span>
        </div>
        <div class="modal-info-row">
            <span class="modal-info-label">💵 মোট পাওনা</span>
            <span class="modal-info-value cell-debt">${fmtMoney(c.totalDebt)}</span>
        </div>
        <div class="modal-info-row">
            <span class="modal-info-label">✅ পূর্বে পরিশোধ</span>
            <span class="modal-info-value cell-paid">${fmtMoney(c.totalPaid)}</span>
        </div>
        <div class="modal-info-row">
            <span class="modal-info-label">⏳ বাকি আছে</span>
            <span class="modal-info-value cell-remain" style="font-size:1.05rem;">${fmtMoney(rem)}</span>
        </div>
    `;

    document.getElementById('payAmountInput').value = '';
    document.getElementById('payNoteInput').value   = '';
    document.getElementById('payDateInput').value   = todayISO();
    openModal('payModal');
    setTimeout(() => document.getElementById('payAmountInput').focus(), 200);
}

function confirmPayment() {
    const amount = parseFloat(document.getElementById('payAmountInput').value);
    const note   = document.getElementById('payNoteInput').value.trim();
    const date   = document.getElementById('payDateInput').value || todayISO();

    const customers = Store.customers;
    const c = customers.find(x => x.id === _payingId);
    if (!c) return;

    const rem = c.totalDebt - c.totalPaid;
    if (isNaN(amount) || amount <= 0) { showToast('error','⚠️','সঠিক পরিমাণ লিখুন!'); return; }
    if (amount > rem + 0.01)          { showToast('error','⚠️', `সর্বোচ্চ ${fmtMoney(rem)} পরিশোধ করা যাবে!`); return; }

    c.totalPaid += amount;
    const payEntry = { amount, note, date: fmtDate(date) };
    c.history.push(payEntry);
    Store.customers = customers;

    const history = Store.history;
    history.unshift({
        id: genId('h'),
        customerId:   c.id,
        customerName: c.name,
        phone:        c.phone,
        amount,
        note,
        date:      fmtDate(date),
        remaining: c.totalDebt - c.totalPaid,
    });
    Store.history = history;

    closeModal('payModal');
    renderCustomers();
    renderDashboard();

    const newRem = c.totalDebt - c.totalPaid;
    if (newRem <= 0.01) {
        showToast('success','🎉 সম্পূর্ণ পরিশোধ!', `${c.name} সব টাকা পরিশোধ করেছেন!`, 5000);
    } else {
        showToast('success','✅ পরিশোধ গ্রহণ', `${fmtMoney(amount)} পাওয়া গেছে। বাকি: ${fmtMoney(newRem)}`);
    }
}