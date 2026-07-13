/* ============================================
   NOTES.JS — নোট ও রিমাইন্ডার
============================================ */

let _editingNoteId = null;

function updateNoteCustomerSelect() {
    const sel = document.getElementById('noteCustomer');
    if (!sel) return;
    const customers = Store.customers;
    sel.innerHTML = '<option value="">— কাউকে নির্বাচন করুন —</option>'
        + customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join('');
}

function getSelectedColor() {
    const sel = document.querySelector('#colorOptions .color-option.selected');
    return sel ? sel.dataset.color : '#6C63FF';
}

function openNoteModal(customerId = null) {
    _editingNoteId = null;
    document.getElementById('noteModalTitle').textContent = '📝 নতুন নোট';
    document.getElementById('noteTitle').value    = '';
    document.getElementById('noteText').value     = '';
    document.getElementById('noteDeadline').value = '';
    document.getElementById('notePriority').value = 'normal';

    updateNoteCustomerSelect();
    document.getElementById('noteCustomer').value = customerId || '';

    document.querySelectorAll('.color-option').forEach((o,i) => o.classList.toggle('selected', i===0));
    openModal('noteModal');
    setTimeout(() => document.getElementById('noteTitle').focus(), 200);
}

function editNote(id) {
    const notes = Store.notes;
    const n = notes.find(x => x.id === id);
    if (!n) return;

    _editingNoteId = id;
    document.getElementById('noteModalTitle').textContent = '✏️ নোট সম্পাদনা';

    updateNoteCustomerSelect();
    document.getElementById('noteTitle').value    = n.title;
    document.getElementById('noteText').value     = n.text || '';
    document.getElementById('noteDeadline').value = n.deadline || '';
    document.getElementById('notePriority').value = n.priority || 'normal';
    document.getElementById('noteCustomer').value = n.custId || '';

    document.querySelectorAll('.color-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.color === (n.color || '#6C63FF'));
    });

    openModal('noteModal');
}

function saveNote() {
    const title    = document.getElementById('noteTitle').value.trim();
    const text     = document.getElementById('noteText').value.trim();
    const deadline = document.getElementById('noteDeadline').value;
    const priority = document.getElementById('notePriority').value;
    const custId   = document.getElementById('noteCustomer').value;
    const color    = getSelectedColor();

    if (!title) { showToast('error','⚠️','শিরোনাম লিখুন!'); return; }

    const customers = Store.customers;
    const custName  = custId ? (customers.find(c => c.id === custId)?.name || '') : '';

    let notes = Store.notes;

    if (_editingNoteId) {
        const idx = notes.findIndex(n => n.id === _editingNoteId);
        if (idx !== -1) {
            notes[idx] = { ...notes[idx], title, text, deadline, priority, custId, custName, color };
        }
    } else {
        notes.unshift({
            id: genId('n'),
            title, text, deadline, priority,
            custId, custName, color,
            date: fmtDate(todayISO()),
        });
    }

    Store.notes = notes;
    closeModal('noteModal');
    renderNotes();
    showToast('success','📝 নোট সংরক্ষিত', title);
}

function deleteNote(id) {
    if (!confirm('এই নোটটি মুছে ফেলতে চান?')) return;
    Store.notes = Store.notes.filter(n => n.id !== id);
    renderNotes();
    showToast('info','🗑️ নোট মুছে ফেলা হয়েছে','');
}

function renderNotes() {
    const notes  = Store.notes;
    const filter = (document.querySelector('#noteFilterTabs .filter-tab.active')?.dataset?.filter) || 'all';
    const grid   = document.getElementById('notesGrid');
    const empty  = document.getElementById('notesEmpty');

    let list = [...notes];

    if (filter === 'overdue')     list = list.filter(n => { const d = getDeadlineInfo(n.deadline); return d && d.type === 'overdue'; });
    if (filter === 'soon')        list = list.filter(n => { const d = getDeadlineInfo(n.deadline); return d && d.type === 'soon'; });
    if (filter === 'no-deadline') list = list.filter(n => !n.deadline);

    if (list.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    const priorityLabel = { high:'🔴 জরুরি', normal:'🔵 সাধারণ', low:'⚪ কম গুরুত্ব' };
    const priorityCls   = { high:'priority-high', normal:'priority-normal', low:'priority-low' };

    grid.innerHTML = list.map(n => {
        const dl    = getDeadlineInfo(n.deadline);
        const cust  = n.custId ? Store.customers.find(c => c.id === n.custId) : null;
        const debt  = cust ? fmtMoney(cust.totalDebt - cust.totalPaid) : null;

        return `<div class="note-card">
            <div class="note-color-bar" style="background:${n.color||'#6C63FF'};"></div>
            <div class="note-top">
                <div class="note-title">${n.title}</div>
                <span class="note-priority ${priorityCls[n.priority||'normal']}">${priorityLabel[n.priority||'normal']}</span>
            </div>
            ${n.custName ? `<div class="note-customer">👤 ${n.custName}${debt ? ` — বাকি: ${debt}` : ''}</div>` : ''}
            ${dl ? `<div class="note-deadline ${dl.cls}">${dl.text}</div>` : ''}
            ${n.text ? `<div class="note-text">${n.text}</div>` : ''}
            <div class="note-footer">
                <div class="note-date">📅 ${n.date}</div>
                <div class="action-btns">
                    <button class="btn-sm btn-detail" onclick="editNote('${n.id}')">✏️</button>
                    <button class="btn-sm btn-del" onclick="deleteNote('${n.id}')">🗑️</button>
                </div>
            </div>
        </div>`;
    }).join('');
}