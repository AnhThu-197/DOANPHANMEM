// ============================================
// UI HELPERS - Tab, Modal, Dropdown, Upload
// ============================================

function switchTab(tabId) {
    const selectedTab = document.getElementById(tabId);
    if (!selectedTab) return;

    // 1. Chỉ deactivate các tab-content là anh em ruột (cùng cha) với selectedTab
    const parent = selectedTab.parentElement;
    if (parent) {
        const siblingTabs = parent.querySelectorAll(':scope > .tab-content');
        siblingTabs.forEach(t => t.classList.remove('active'));
    }

    // Active tab-content được chọn
    selectedTab.classList.add('active');
    
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

    // Tìm tất cả các button có liên kết đến tabId này làm fallback
    const buttons = document.querySelectorAll('.tab-btn');
    const targetButtons = [];
    buttons.forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && (onclickAttr.includes(`'${tabId}'`) || onclickAttr.includes(`"${tabId}"`))) {
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
}


function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        // Tự động mở lại modal chi tiết khách hàng nếu đóng modal tương tác được mở từ chi tiết
        if (modalId === 'interactionModal') {
            const openedFromDetail = modal.dataset.openedFromDetail === "true";
            const parentCustomerId = modal.dataset.parentCustomerId;
            if (openedFromDetail && parentCustomerId) {
                modal.dataset.openedFromDetail = "false";
                if (typeof openCustomerDetailModal === 'function') {
                    openCustomerDetailModal(parseInt(parentCustomerId));
                }
            }
        }
    }
}

// Populate dropdown khách hàng (hỗ trợ API session)
async function populateCustomerDropdown(selectId, selectedValue = null) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
    
    const isApiSession = typeof AUTH !== 'undefined' && AUTH.getCurrentUser()?.authSource === 'api';
    
    if (isApiSession) {
        try {
            const response = await API_SERVICES.khachHang.list();
            const customers = (response.data || response || []).filter(c => !c.daXoa);
            
            // Lưu trữ toàn cục để các trang có thể truy cập thông tin chi tiết khách hàng
            window.CURRENT_CUSTOMERS = customers;
            
            customers.forEach(customer => {
                const option = document.createElement('option');
                const cid = customer.maKhachHang || customer.id;
                option.value = String(cid);
                option.textContent = customer.hoTen || customer.name;
                if (selectedValue !== null && selectedValue !== undefined && Number(cid) === Number(selectedValue)) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
            
            if (selectedValue !== null && selectedValue !== undefined) {
                select.value = String(selectedValue);
            }
        } catch (error) {
            console.error('Error populating customer dropdown:', error);
        }
    } else {
        DATA.customers.filter(c => !c.deleted).forEach(customer => {
            const option = document.createElement('option');
            option.value = String(customer.id);
            option.textContent = customer.name;
            if (selectedValue !== null && selectedValue !== undefined && Number(customer.id) === Number(selectedValue)) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        if (selectedValue !== null && selectedValue !== undefined) {
            select.value = String(selectedValue);
        }
    }
}

// Populate dropdown nhân viên (hỗ trợ API session và giữ value được chọn)
async function loadEmployeeDropdown(selectId, includeEmpty = true, selectedValue = null) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const isApiSession = typeof AUTH !== 'undefined' && AUTH.getCurrentUser()?.authSource === 'api';

    if (isApiSession) {
        if (typeof DATA === 'undefined') window.DATA = {};
        
        const renderDropdownOptions = (employees) => {
            let html = includeEmpty ? '<option value="">-- Chọn nhân viên --</option>' : '';
            employees.forEach(emp => {
                const isSelected = selectedValue !== null && selectedValue !== undefined && Number(emp.id) === Number(selectedValue) ? 'selected' : '';
                html += `<option value="${emp.id}" ${isSelected}>${emp.name} (${emp.position})</option>`;
            });
            select.innerHTML = html;
            if (selectedValue !== null && selectedValue !== undefined) {
                select.value = String(selectedValue);
            }
        };

        if (DATA.backendEmployees && DATA.backendEmployees.length > 0) {
            renderDropdownOptions(DATA.backendEmployees);
        } else {
            select.innerHTML = includeEmpty ? '<option value="">-- Đang tải nhân viên... --</option>' : '<option value="">Đang tải...</option>';
            
            if (!DATA.backendEmployeesPromise) {
                DATA.backendEmployeesPromise = API_SERVICES.nhanVien.list()
                    .then(response => {
                        const apiData = Array.isArray(response?.data)
                            ? response.data
                            : Array.isArray(response)
                                ? response
                                : Array.isArray(response?.data?.content)
                                    ? response.data.content
                                    : [];
                        DATA.backendEmployees = apiData.map(nv => ({
                            id: nv.maNhanVien,
                            name: nv.hoTen || nv.email || '',
                            position: nv.chucVu || 'Nhân viên'
                        }));
                        return DATA.backendEmployees;
                    });
            }

            try {
                const employees = await DATA.backendEmployeesPromise;
                renderDropdownOptions(employees);
            } catch (error) {
                console.error('Lỗi tải nhân viên cho dropdown:', error);
                select.innerHTML = includeEmpty ? '<option value="">-- Lỗi tải nhân viên --</option>' : '<option value="">Lỗi tải</option>';
                DATA.backendEmployeesPromise = null;
            }
        }
    } else {
        // Chế độ mock
        let html = includeEmpty ? '<option value="">-- Chọn nhân viên --</option>' : '';
        if (typeof AUTH !== 'undefined' && AUTH.users) {
            AUTH.users.forEach(user => {
                const isSelected = selectedValue !== null && selectedValue !== undefined && Number(user.id) === Number(selectedValue) ? 'selected' : '';
                html += `<option value="${user.id}" ${isSelected}>${user.name} (${user.position || user.role})</option>`;
            });
        }
        select.innerHTML = html;
        if (selectedValue !== null && selectedValue !== undefined) {
            select.value = String(selectedValue);
        }
    }
}

// Populate dropdown mẫu thông điệp
function populateTemplateDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    select.innerHTML = '<option value="">-- Chọn mẫu --</option>';
    
    const templates = isApiSession ? (window.CURRENT_TEMPLATES || []) : DATA.messageTemplates;
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.maMau || template.id;
        option.textContent = `${template.tieuDe || template.name} (${template.loaiThongDiep || template.type})`;
        select.appendChild(option);
    });
}

// File upload display
function updateFileName(input, displayId) {
    const label   = input.nextElementSibling;
    const display = document.getElementById(displayId);

    if (input.files && input.files.length > 0) {
        if (input.files.length === 1) {
            const file     = input.files[0];
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            display.innerHTML = `<i class="fas fa-file-alt"></i> ${file.name} (${fileSize} MB)`;
        } else {
            let totalSize = 0;
            for (let i = 0; i < input.files.length; i++) {
                totalSize += input.files[i].size;
            }
            const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
            display.innerHTML = `<i class="fas fa-copy"></i> Đã chọn ${input.files.length} tệp (${totalSizeMB} MB)`;
        }
        if (label) label.classList.add('has-file');
    } else {
        display.textContent = 'Chọn file hoặc kéo thả vào đây';
        if (label) label.classList.remove('has-file');
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function setupFileUploadDragDrop() {
    const fileLabels = document.querySelectorAll('.file-upload-label');
    fileLabels.forEach(label => {
        const input = label.previousElementSibling;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
            label.addEventListener(ev, preventDefaults, false);
            document.body.addEventListener(ev, preventDefaults, false);
        });
        ['dragenter', 'dragover'].forEach(ev => {
            label.addEventListener(ev, () => label.classList.add('drag-over'), false);
        });
        ['dragleave', 'drop'].forEach(ev => {
            label.addEventListener(ev, () => label.classList.remove('drag-over'), false);
        });
        label.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (input && files.length > 0) {
                input.files = files;
                const displayId = label.querySelector('span')?.id;
                if (displayId) updateFileName(input, displayId);
            }
        }, false);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupFileUploadDragDrop, 1000);
});
