/**
 * Modals Manager - Nhóm 8 CRM
 * Quản lý mở/đóng modal, load modals từ file riêng
 */

// =============================================
// MODAL CORE FUNCTIONS
// =============================================

/**
 * Mở modal theo ID
 */
if (typeof openModal === 'undefined') {
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };
}

/**
 * Đóng modal theo ID
 */
if (typeof closeModal === 'undefined') {
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };
}

/**
 * Đóng modal khi click bên ngoài
 */
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = '';
    }
});

/**
 * Đóng modal khi nhấn ESC
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex' || modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});

// =============================================
// TAB SWITCHING
// =============================================

/**
 * Chuyển tab trong modal
 */
if (typeof switchTab === 'undefined') {
    window.switchTab = function(tabName) {
        const targetTab = document.getElementById(tabName);
        if (!targetTab) return;

        // 1. Chỉ deactivate các tab-content là anh em ruột (cùng cha) với targetTab
        const parent = targetTab.parentElement;
        if (parent) {
            const siblingTabs = parent.querySelectorAll(':scope > .tab-content');
            siblingTabs.forEach(t => t.classList.remove('active'));
        }

        // Active tab-content được chọn
        targetTab.classList.add('active');

        // 2. Tìm nút tab-btn tương ứng và chỉ deactivate các nút cùng thanh tab
        let clickedButton = null;
        if (typeof window !== 'undefined' && window.event) {
            const e = window.event;
            if (e.currentTarget && e.currentTarget.classList.contains('tab-btn')) {
                clickedButton = e.currentTarget;
            } else if (e.target) {
                clickedButton = e.target.closest('.tab-btn');
            }
        }

        // Tìm tất cả các button có liên kết đến tabName này làm fallback
        const buttons = document.querySelectorAll('.tab-btn');
        const targetButtons = [];
        buttons.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr && (onclickAttr.includes(`'${tabName}'`) || onclickAttr.includes(`"${tabName}"`))) {
                targetButtons.push(btn);
            }
        });

        if (clickedButton) {
            const tabsContainer = clickedButton.closest('.tabs');
            if (tabsContainer) {
                tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            }
            clickedButton.classList.add('active');
        } else {
            targetButtons.forEach(btn => {
                const tabsContainer = btn.closest('.tabs');
                if (tabsContainer) {
                    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                }
                btn.classList.add('active');
            });
        }
    };
}

// =============================================
// ASSIGN UI
// =============================================

function updateAssignUI() {
    const method = document.getElementById('assignMethod').value;
    document.getElementById('assignManual').style.display = method === 'manual' ? 'block' : 'none';
    document.getElementById('assignRoundRobin').style.display = method === 'round_robin' ? 'block' : 'none';
    document.getElementById('assignRatio').style.display = method === 'ratio' ? 'block' : 'none';
}

// =============================================
// FILE UPLOAD HELPER
// =============================================

if (typeof updateFileName === 'undefined') {
    window.updateFileName = function(input, displayId) {
        const display = document.getElementById(displayId);
        if (input.files && input.files.length > 0) {
            display.textContent = input.files[0].name;
        } else {
            display.textContent = 'Chọn file hoặc kéo thả vào đây';
        }
    };
}

// =============================================
// APPOINTMENT TYPE TOGGLE
// =============================================

function toggleReminderMessageType() {
    const type = document.getElementById('appointmentType');
    const reminderCustomer = document.getElementById('reminderCustomer');
    const locationSection = document.getElementById('meetingLocationSection');
    const reminderSection = document.getElementById('reminderMessageTypeSection');

    if (locationSection) {
        locationSection.style.display =
            (type && (type.value === 'meeting' || type.value === 'video')) ? 'block' : 'none';
    }

    if (reminderSection) {
        const showReminder = (type && (type.value === 'meeting' || type.value === 'video'))
            && (reminderCustomer && reminderCustomer.checked);
        reminderSection.style.display = showReminder ? 'block' : 'none';
    }
}

// =============================================
// LOAD MODALS FROM EXTERNAL FILE
// =============================================

/**
 * Load modals HTML từ file components/modals.html
 * Gọi khi DOMContentLoaded
 */
async function loadModals() {
    try {
        const response = await fetch('components/modals.html');
        if (response.ok) {
            const html = await response.text();
            const container = document.getElementById('modalsContainer');
            if (container) {
                container.innerHTML = html;
            }
        }
    } catch (error) {
        console.warn('Could not load modals from external file, using inline modals.');
    }
}
