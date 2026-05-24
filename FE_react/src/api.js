// FE/src/api.js
// CẦU NỐI API HYBRID - KẾT NỐI SPRING BOOT REST API VÀ TỰ ĐỘNG DỰ PHÒNG (FALLBACK)

const BASE_URL = 'http://localhost:8080/api';

// Biến trạng thái để theo dõi xem Backend có Online hay không
let isBackendOnline = false;

// Hàm kiểm tra nhanh sức khỏe Backend
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${BASE_URL}/cauhinh`, { 
      method: 'GET', 
      signal: controller.signal 
    });
    clearTimeout(id);
    isBackendOnline = response.ok;
  } catch (error) {
    isBackendOnline = false;
  }
  console.log(`[CRM Integration] Backend Server status: ${isBackendOnline ? 'ONLINE' : 'OFFLINE (Using Local Memory)'}`);
  return isBackendOnline;
}

// Khởi chạy kiểm tra sức khỏe ban đầu
checkBackendHealth();

// Dữ liệu mock dự phòng khi Server offline (Đồng bộ cấu trúc schema FE_vanilla hoàn toàn bằng tiếng Anh)
const LOCAL_MEMORY = {
  currentUser: null,
  users: [
    { id: 1, username: 'nhanvien', password: '123', name: 'Trần Minh Chiến', role: 'employee', email: 'chien@company.com', phone: '0987654321', avatar: 'TC', department: 'Marketing', position: 'Nhân viên marketing', joinDate: '15/06/2023', manager: 'Nguyễn Hoàng Anh Thư' },
    { id: 2, username: 'truongphong', password: '123', name: 'Nguyễn Hoàng Anh Thư', role: 'manager', email: 'manager@company.com', phone: '0912345678', avatar: 'AT', department: 'Marketing', position: 'Trưởng phòng', joinDate: '10/01/2022', manager: 'Admin System' },
    { id: 3, username: 'admin', password: '123', name: 'Admin System', role: 'admin', email: 'admin@company.com', phone: '0901234567', avatar: 'AS', department: 'IT', position: 'Quản trị viên', joinDate: '01/01/2021', manager: '' }
  ],
  customers: [
    { id: 1, name: 'Công ty ABC', email: 'contact@abc.com', phone: '0912345678', company: 'ABC Corp', status: 'customer', source: 'facebook', industry: 'Công nghệ', score: 85, assignedTo: 1, trialStartDate: null, trialDays: 0, trialStatus: 'Chưa dùng thử', deleted: false, createdDate: '2024-01-15', updatedDate: '2024-03-20', lastInteraction: '2024-03-20' },
    { id: 2, name: 'Công ty XYZ', email: 'info@xyz.com', phone: '0987654321', company: 'XYZ Ltd', status: 'lead', source: 'google', industry: 'Bán lẻ', score: 45, assignedTo: 1, trialStartDate: '2026-05-15', trialDays: 30, trialStatus: 'Đang dùng thử', deleted: false, createdDate: '2024-02-10', updatedDate: '2024-03-18', lastInteraction: '2024-03-18' },
    { id: 3, name: 'Công ty DEF', email: 'sales@def.com', phone: '0901234567', company: 'DEF Inc', status: 'prospect', source: 'direct', industry: 'Dịch vụ', score: 65, assignedTo: 2, trialStartDate: null, trialDays: 0, trialStatus: 'Chưa dùng thử', deleted: false, createdDate: '2024-03-01', updatedDate: '2024-03-22', lastInteraction: '2024-03-22' },
    { id: 4, name: 'Công ty GHI', email: 'info@ghi.com', phone: '0909876543', company: 'GHI Group', status: 'suspect', source: 'website', industry: 'Thương mại', score: 15, assignedTo: 1, trialStartDate: null, trialDays: 0, trialStatus: 'Chưa dùng thử', deleted: false, createdDate: '2024-03-25', updatedDate: '2024-03-25', lastInteraction: '2024-03-25' },
    { id: 5, name: 'Công ty JKL', email: 'contact@jkl.com', phone: '0908765432', company: 'JKL Ltd', status: 'evangelist', source: 'referral', industry: 'Công nghệ', score: 95, assignedTo: 2, trialStartDate: null, trialDays: 0, trialStatus: 'Chưa dùng thử', deleted: false, createdDate: '2023-12-01', updatedDate: '2024-03-26', lastInteraction: '2024-03-26' }
  ],
  appointments: [
    { id: 1, customerId: 1, customerName: 'Công ty ABC', employeeId: 1, title: 'Gọi tư vấn', type: 'call', date: '2024-03-28', time: '14:00', reminderBefore: 30, reminderEmployee: true, reminderCustomer: true, status: 'scheduled', result: null, notes: 'Tư vấn về gói dịch vụ', updatedDate: '2024-03-26' },
    { id: 2, customerId: 2, customerName: 'Công ty XYZ', employeeId: 1, title: 'Cuộc họp trực tuyến', type: 'video', date: '2024-03-29', time: '10:00', location: 'https://meet.google.com/abc-defg-hij', reminderBefore: 60, reminderEmployee: true, reminderCustomer: true, status: 'scheduled', result: null, notes: 'Thảo luận hợp đồng', updatedDate: '2024-03-27' }
  ],
  interactions: [
    { id: 1, customerId: 1, employeeId: 1, type: 'call', content: 'Tư vấn sản phẩm', notes: 'Khách hàng quan tâm', date: '2024-03-20', updatedDate: '2024-03-20', file: null },
    { id: 2, customerId: 2, employeeId: 1, type: 'email', content: 'Gửi báo giá', notes: 'Chờ phản hồi', date: '2024-03-18', updatedDate: '2024-03-18', file: null }
  ],
  templates: [
    { id: 1, name: 'Chào mừng khách hàng mới', type: 'email', content: 'Xin chào {customerName}, chúc bạn một ngày tốt lành!' },
    { id: 2, name: 'Khuyến mãi đặc biệt', type: 'sms', content: 'Xin chào {customerName}, tặng bạn mã giảm giá đặc biệt!' }
  ],
  messageHistory: [],
  deleteRequests: [
    { id: 1, customerId: 2, customerName: 'Công ty XYZ', requestedBy: 'Trần Minh Chiến', reason: 'Khách hàng không còn hoạt động, SĐT không liên lạc được', requestedDate: '25/03/2026', status: 'pending' }
  ],
  systemConfig: {
    companyName: 'TẬP ĐOÀN CÔNG NGHỆ CRM VIỆT NAM',
    email: 'contact@crmcorp.vn',
    phone: '0987654321',
    website: 'https://crmcorp.vn',
    address: 'Tầng 15, Tòa nhà Innovation, Công viên phần mềm Quang Trung, Quận 12, TP.HCM',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    currency: 'VND',
    language: 'vi',
    emailNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    sessionTimeout: 45,
    maxFailedAttempts: 5,
    passwordExpiryDays: 90,
    twoFactorAuth: false,
    autoBackup: true,
    backupFrequency: 'weekly'
  }
};

// MAPPERS: Chuyển đổi giữa Entity Backend SQL Server (tiếng Việt) và state React (tiếng Anh của FE_vanilla)
function mapKhachHangToFe(kh) {
  if (!kh) return null;
  return {
    id: kh.maKhachHang,
    name: kh.hoTen,
    email: kh.email,
    phone: kh.soDienThoai,
    company: kh.congTy,
    status: kh.trangThaiKhach,
    score: kh.diemTiemNang,
    trialStartDate: kh.ngayBatDauDungThu,
    trialDays: kh.soNgayDungThu,
    trialStatus: kh.trangThaiDungThu,
    deleted: kh.daXoa || false,
    deleteReason: kh.lyDoXoa,
    deletedDate: kh.ngayXoa,
    createdDate: kh.ngayTao ? kh.ngayTao.substring(0, 10) : '',
    updatedDate: kh.ngayCapNhat ? kh.ngayCapNhat.substring(0, 10) : '',
    source: kh.maNguonKH === 1 ? 'facebook' : kh.maNguonKH === 2 ? 'google' : kh.maNguonKH === 3 ? 'direct' : kh.maNguonKH === 4 ? 'referral' : 'website',
    industry: kh.maNganhNghe === 1 ? 'Công nghệ' : kh.maNganhNghe === 2 ? 'Bán lẻ' : 'Dịch vụ',
    assignedTo: kh.nguoiPhuTrach ? kh.nguoiPhuTrach.maNhanVien : 1
  };
}

function mapKhachHangToBe(kh) {
  if (!kh) return null;
  return {
    maKhachHang: kh.id || null,
    hoTen: kh.name || '',
    email: kh.email || '',
    soDienThoai: kh.phone || '',
    congTy: kh.company || '',
    trangThaiKhach: kh.status || 'Người truy cập',
    diemTiemNang: kh.score !== undefined ? kh.score : 0,
    ngayBatDauDungThu: kh.trialStartDate || null,
    soNgayDungThu: kh.trialDays !== undefined ? parseInt(kh.trialDays) : 0,
    trangThaiDungThu: kh.trialStatus || 'Chưa dùng thử',
    daXoa: kh.deleted || false,
    lyDoXoa: kh.deleteReason || null,
    maNguonKH: kh.source === 'facebook' ? 1 : kh.source === 'google' ? 2 : kh.source === 'direct' ? 3 : kh.source === 'referral' ? 4 : 5,
    maNganhNghe: kh.industry === 'Công nghệ' ? 1 : kh.industry === 'Bán lẻ' ? 2 : 3
  };
}

function mapTemplateToFe(t) {
  if (!t) return null;
  return {
    id: t.id,
    name: t.title,
    type: t.type ? t.type.toLowerCase() : 'email',
    content: t.content,
    creatorId: t.creatorId,
    creatorName: t.creatorName,
    useCount: t.useCount || 0
  };
}

function mapAppointmentToFe(a) {
  if (!a) return null;
  return {
    id: a.id,
    customerId: a.customerId,
    customerName: a.customerName,
    employeeId: a.employeeId,
    employeeName: a.employeeName,
    title: a.title,
    type: a.type || 'call',
    date: a.date,
    time: a.time,
    reminderBefore: a.reminderBefore,
    notes: a.notes,
    status: a.status,
    result: a.result,
    resultNotes: a.resultNotes
  };
}

function mapInteractionToFe(i) {
  if (!i) return null;
  return {
    id: i.id,
    customerId: i.customerId,
    customerName: i.customerName,
    employeeId: i.employeeId,
    employeeName: i.employeeName,
    type: i.type || 'call',
    content: i.content,
    notes: i.notes,
    date: i.date ? i.date.substring(0, 19).replace('T', ' ') : '',
    file: i.attachments && i.attachments.length > 0 ? {
      ...i.attachments[0],
      fileUrl: i.attachments[0].downloadUrl ? `http://localhost:8080${i.attachments[0].downloadUrl}` : '#'
    } : null,
    attachments: i.attachments ? i.attachments.map(att => ({
      ...att,
      fileUrl: att.downloadUrl ? `http://localhost:8080${att.downloadUrl}` : '#'
    })) : []
  };
}

// CÁC HÀM XỬ LÝ API HYBRID
export const API = {
  isOnline() {
    return isBackendOnline;
  },

  // 1. TÀI KHOẢN & ĐĂNG NHẬP (HYBRID)
  async login(username, password) {
    await checkBackendHealth();
    let searchUsername = username;
    let searchPassword = password;

    if (isBackendOnline) {
      // Ánh xạ tài khoản demo sang email thật trong CSDL
      if (username === 'nhanvien' && password === '123') {
        searchUsername = 'nv01@crm.vn';
        searchPassword = 'nv01123';
      } else if (username === 'truongphong' && password === '123') {
        searchUsername = 'anhthu@gmail.com';
        searchPassword = 'tp123';
      } else if (username === 'admin' && password === '123') {
        searchUsername = 'admin@gmail.com';
        searchPassword = 'admin123';
      }

      try {
        const response = await fetch(`${BASE_URL}/taikhoan`);
        if (response.ok) {
          const accounts = await response.json();
          const acc = accounts.find(a => a.email === searchUsername && a.matKhau === searchPassword);
          if (acc) {
            const role = acc.maVaiTro === 1 ? 'admin' : (acc.maVaiTro === 2 ? 'manager' : 'employee');
            const user = {
              id: acc.maTaiKhoan,
              username: username,
              name: role === 'admin' ? 'Admin System' : (role === 'manager' ? 'Nguyễn Hoàng Anh Thư' : 'Trần Minh Chiến'),
              email: acc.email,
              role: role,
              phone: role === 'admin' ? '0901234567' : (role === 'manager' ? '0912345678' : '0987654321'),
              avatar: role === 'admin' ? 'AS' : (role === 'manager' ? 'AT' : 'TC'),
              department: role === 'admin' ? 'IT' : 'Marketing',
              position: role === 'admin' ? 'Quản trị viên' : (role === 'manager' ? 'Trưởng phòng' : 'Nhân viên marketing')
            };
            LOCAL_MEMORY.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
          }
        }
      } catch (err) {
        console.error('Lỗi API Login:', err);
      }
    }

    // Fallback Mock Đăng nhập offline
    const user = LOCAL_MEMORY.users.find(u => u.username === username && u.password === password);
    if (user) {
      LOCAL_MEMORY.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
  },

  async sendOtp(email) {
    await checkBackendHealth();
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/taikhoan/quen-mat-khau`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        throw new Error('Gửi OTP thất bại! Vui lòng kiểm tra email.');
      }
      return true;
    }
    // Mock
    const exist = LOCAL_MEMORY.users.some(u => u.email === email);
    if (!exist) throw new Error('Email không tồn tại trên hệ thống mock!');
    const mockOtp = '123456';
    sessionStorage.setItem('resetOTP', mockOtp);
    sessionStorage.setItem('resetEmail', email);
    return true;
  },

  async verifyOtp(email, otp) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/taikhoan/xac-thuc-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      if (!response.ok) {
        throw new Error('Mã OTP không chính xác hoặc đã hết hạn!');
      }
      return true;
    }
    // Mock
    const storedOtp = sessionStorage.getItem('resetOTP');
    if (storedOtp === otp) {
      return true;
    }
    throw new Error('Mã OTP mock không chính xác!');
  },

  async resetPassword(email, newPassword) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/taikhoan/dat-lai-mat-khau`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      if (!response.ok) {
        throw new Error('Đặt lại mật khẩu thất bại!');
      }
      return true;
    }
    // Mock
    const user = LOCAL_MEMORY.users.find(u => u.email === email);
    if (user) {
      user.password = newPassword;
      return true;
    }
    throw new Error('Cập nhật mật khẩu mock thất bại!');
  },

  // 2. KHÁCH HÀNG & DÙNG THỬ (HYBRID + MAPPING)
  async getCustomers() {
    await checkBackendHealth();
    if (isBackendOnline) {
      try {
        const response = await fetch(`${BASE_URL}/khachhang`);
        if (response.ok) {
          const list = await response.json();
          return list.map(mapKhachHangToFe);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    }
    return LOCAL_MEMORY.customers;
  },

  async createCustomer(customer) {
    if (isBackendOnline) {
      const body = mapKhachHangToBe(customer);
      const response = await fetch(`${BASE_URL}/khachhang`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const saved = await response.json();
        return mapKhachHangToFe(saved);
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi thêm mới khách hàng.');
    }
    const newId = Math.max(...LOCAL_MEMORY.customers.map(c => c.id), 0) + 1;
    const newCust = { ...customer, id: newId, deleted: false };
    LOCAL_MEMORY.customers.push(newCust);
    return newCust;
  },

  async updateCustomer(id, customer) {
    if (isBackendOnline) {
      const body = mapKhachHangToBe(customer);
      const response = await fetch(`${BASE_URL}/khachhang/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const updated = await response.json();
        return mapKhachHangToFe(updated);
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi cập nhật khách hàng.');
    }
    const index = LOCAL_MEMORY.customers.findIndex(c => c.id === id);
    if (index > -1) {
      LOCAL_MEMORY.customers[index] = { ...LOCAL_MEMORY.customers[index], ...customer };
      return LOCAL_MEMORY.customers[index];
    }
    throw new Error('Không tìm thấy khách hàng mock để cập nhật.');
  },

  async deleteCustomer(id) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/khachhang/${id}/soft?lyDo=Đề nghị xóa từ CRM`, { method: 'DELETE' });
      return response.ok;
    }
    const index = LOCAL_MEMORY.customers.findIndex(c => c.id === id);
    if (index > -1) {
      LOCAL_MEMORY.customers[index].deleted = true;
      LOCAL_MEMORY.customers[index].deletedDate = new Date().toLocaleDateString('vi-VN');
      return true;
    }
    return false;
  },

  async permanentDeleteCustomer(id) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/khachhang/${id}/permanent`, { method: 'DELETE' });
      return response.ok;
    }
    LOCAL_MEMORY.customers = LOCAL_MEMORY.customers.filter(c => c.id !== id);
    return true;
  },

  async getTrialDetails(customerId) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/khachhang/${customerId}/dungthu`);
      if (response.ok) {
        const details = await response.json();
        return {
          customerId: customerId,
          customerName: details.customerName,
          startDate: details.startDate,
          durationDays: details.durationDays,
          status: details.status,
          remainingDays: details.remainingDays
        };
      }
    }
    // Mock
    const cust = LOCAL_MEMORY.customers.find(c => c.id === customerId);
    if (cust) {
      let remainingDays = 0;
      if (cust.trialStartDate && cust.trialDays > 0) {
        const start = new Date(cust.trialStartDate);
        const end = new Date(start.getTime() + cust.trialDays * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diffTime = end - now;
        remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (remainingDays < 0) remainingDays = 0;
      }
      return {
        customerId: cust.id,
        customerName: cust.name,
        startDate: cust.trialStartDate,
        durationDays: cust.trialDays,
        status: cust.trialStatus || 'Chưa dùng thử',
        remainingDays: remainingDays
      };
    }
    throw new Error('Không tìm thấy thông tin dùng thử mock.');
  },

  async updateTrialDetails(customerId, startDate, durationDays, status = 'Đang dùng thử') {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/khachhang/${customerId}/dungthu`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, durationDays, status })
      });
      if (response.ok) {
        const updated = await response.json();
        return updated;
      }
      throw new Error('Lỗi cập nhật thông tin dùng thử.');
    }
    // Mock
    const cust = LOCAL_MEMORY.customers.find(c => c.id === customerId);
    if (cust) {
      cust.trialStartDate = startDate;
      cust.trialDays = parseInt(durationDays);
      cust.trialStatus = status;

      const start = new Date(startDate);
      const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
      if (end < new Date()) {
        cust.trialStatus = 'Hết hạn dùng thử';
      }
      return this.getTrialDetails(customerId);
    }
    throw new Error('Không tìm thấy khách hàng dùng thử mock.');
  },

  // 3. LỊCH HẸN & NHẮC NHỞ (HYBRID)
  async getAppointments() {
    await checkBackendHealth();
    if (isBackendOnline) {
      try {
        const response = await fetch(`${BASE_URL}/lichhen`);
        if (response.ok) {
          const list = await response.json();
          return list.map(mapAppointmentToFe);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    }
    return LOCAL_MEMORY.appointments;
  },

  async createAppointment(appointment) {
    if (isBackendOnline) {
      const body = {
        customerId: parseInt(appointment.customerId),
        employeeId: 3,
        title: appointment.title,
        type: appointment.type || 'call',
        date: appointment.date,
        time: appointment.time,
        reminderBefore: parseInt(appointment.reminderBefore || 30),
        notes: appointment.notes
      };
      const response = await fetch(`${BASE_URL}/lichhen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const saved = await response.json();
        return mapAppointmentToFe(saved);
      }
      throw new Error('Lỗi tạo nhắc nhở lịch hẹn.');
    }
    // Mock
    const cust = LOCAL_MEMORY.customers.find(c => c.id === parseInt(appointment.customerId));
    const newId = Math.max(...LOCAL_MEMORY.appointments.map(a => a.id), 0) + 1;
    const newApp = {
      id: newId,
      customerId: parseInt(appointment.customerId),
      customerName: cust ? cust.name : 'Khách hàng',
      employeeId: 1,
      employeeName: 'Trần Minh Chiến',
      title: appointment.title,
      type: appointment.type || 'call',
      date: appointment.date,
      time: appointment.time,
      reminderBefore: parseInt(appointment.reminderBefore || 30),
      notes: appointment.notes,
      status: 'scheduled',
      result: null
    };
    LOCAL_MEMORY.appointments.push(newApp);
    return newApp;
  },

  async updateAppointmentResult(id, result, resultNotes) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/lichhen/${id}/ketqua`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, resultNotes })
      });
      if (response.ok) {
        const updated = await response.json();
        return mapAppointmentToFe(updated);
      }
      throw new Error('Lỗi cập nhật kết quả lịch hẹn.');
    }
    // Mock
    const app = LOCAL_MEMORY.appointments.find(a => a.id === id);
    if (app) {
      app.status = 'completed';
      app.result = result === 'success' ? 'Thành công' : (result === 'busy' ? 'Khách bận' : 'Khách từ chối');
      app.resultNotes = resultNotes;

      // Sync mock interaction
      const newInterId = Math.max(...LOCAL_MEMORY.interactions.map(i => i.id), 0) + 1;
      LOCAL_MEMORY.interactions.push({
        id: newInterId,
        customerId: app.customerId,
        employeeId: app.employeeId,
        type: app.type,
        content: `Kết quả cuộc hẹn: ${app.title}`,
        notes: `${app.type === 'call' ? 'Gọi điện' : 'Lịch hẹn'}: ${app.title} - Kết quả: ${app.result}. Ghi chú: ${resultNotes}`,
        date: new Date().toISOString().substring(0, 19).replace('T', ' '),
        file: null
      });
      return app;
    }
    throw new Error('Không tìm thấy lịch hẹn mock.');
  },

  async deleteAppointment(id) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/lichhen/${id}`, { method: 'DELETE' });
      return response.ok;
    }
    LOCAL_MEMORY.appointments = LOCAL_MEMORY.appointments.filter(a => a.id !== id);
    return true;
  },

  // 4. MẪU THÔNG ĐIỆP & MARKETING (HYBRID)
  async getTemplates() {
    await checkBackendHealth();
    if (isBackendOnline) {
      try {
        const response = await fetch(`${BASE_URL}/thongdiep/mau`);
        if (response.ok) {
          const list = await response.json();
          return list.map(mapTemplateToFe);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    }
    return LOCAL_MEMORY.templates;
  },

  async createTemplate(template) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/thongdiep/mau`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.name,
          content: template.content,
          type: template.type || 'email',
          creatorId: 3
        })
      });
      if (response.ok) {
        const saved = await response.json();
        return mapTemplateToFe(saved);
      }
      throw new Error('Lỗi tạo mẫu thông điệp.');
    }
    const newId = Math.max(...LOCAL_MEMORY.templates.map(t => t.id), 0) + 1;
    const newT = {
      id: newId,
      name: template.name,
      type: template.type || 'email',
      content: template.content
    };
    LOCAL_MEMORY.templates.push(newT);
    return newT;
  },

  async updateTemplate(id, template) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/thongdiep/mau/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.name,
          content: template.content,
          type: template.type || 'email',
          creatorId: 3
        })
      });
      if (response.ok) {
        const updated = await response.json();
        return mapTemplateToFe(updated);
      }
      throw new Error('Lỗi cập nhật mẫu thông điệp.');
    }
    const index = LOCAL_MEMORY.templates.findIndex(t => t.id === id);
    if (index > -1) {
      LOCAL_MEMORY.templates[index] = { ...LOCAL_MEMORY.templates[index], name: template.name, content: template.content, type: template.type };
      return LOCAL_MEMORY.templates[index];
    }
    throw new Error('Không tìm thấy mẫu mock.');
  },

  async deleteTemplate(id) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/thongdiep/mau/${id}`, { method: 'DELETE' });
      return response.ok;
    }
    LOCAL_MEMORY.templates = LOCAL_MEMORY.templates.filter(t => t.id !== id);
    return true;
  },

  async sendMessage(message) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/thongdiep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(message.customerId),
          employeeId: 3,
          templateId: message.templateId ? parseInt(message.templateId) : null,
          type: message.type || 'email',
          content: message.content,
          promoTitle: message.promoTitle || '',
          promoDescription: message.promoDescription || '',
          promoCode: message.promoCode || '',
          promoExpiry: message.promoExpiry || '',
          promoLink: message.promoLink || '',
          schedule: message.isScheduled || false,
          scheduleTime: message.scheduleTime || null,
          trackOpen: message.trackOpen !== undefined ? message.trackOpen : true
        })
      });
      if (response.ok) return await response.json();
      throw new Error('Gửi thông điệp marketing thất bại!');
    }

    // Mock
    const cust = LOCAL_MEMORY.customers.find(c => c.id === parseInt(message.customerId));
    const newId = Math.max(...LOCAL_MEMORY.messageHistory.map(h => h.id), 0) + 1;
    const historyEntry = {
      id: newId,
      customerId: message.customerId,
      customerName: cust ? cust.name : 'Khách hàng',
      channel: message.type || 'Email',
      title: message.promoTitle || 'Thông điệp chăm sóc',
      content: message.content,
      status: 'Đã gửi',
      sentTime: new Date().toISOString()
    };
    LOCAL_MEMORY.messageHistory.push(historyEntry);

    // Sync mock interaction
    const newInterId = Math.max(...LOCAL_MEMORY.interactions.map(i => i.id), 0) + 1;
    LOCAL_MEMORY.interactions.push({
      id: newInterId,
      customerId: parseInt(message.customerId),
      employeeId: 1,
      type: message.type === 'email' ? 'email' : 'message',
      content: message.promoTitle || 'Gửi thông điệp Marketing',
      notes: message.content + (message.promoCode ? ` [Mã KM: ${message.promoCode}]` : ''),
      date: new Date().toISOString().substring(0, 19).replace('T', ' '),
      file: null
    });

    return historyEntry;
  },

  async getMessageHistory() {
    if (isBackendOnline) {
      try {
        const response = await fetch(`${BASE_URL}/thongdiep/lichsu`);
        if (response.ok) {
          const list = await response.json();
          return list.map(item => ({
            id: item.id,
            customerId: item.customerId,
            customerName: item.customerName,
            channel: item.channel,
            title: item.title,
            content: item.content,
            status: item.status,
            sentTime: item.sentTime
          }));
        }
      } catch (err) {
        console.error('Error fetching message history:', err);
      }
    }
    return LOCAL_MEMORY.messageHistory;
  },

  // 5. TƯƠNG TÁC & TỆP ĐÍNH KÈM (HYBRID)
  async getInteractions() {
    await checkBackendHealth();
    if (isBackendOnline) {
      try {
        const response = await fetch(`${BASE_URL}/tuongtac`);
        if (response.ok) {
          const list = await response.json();
          return list.map(mapInteractionToFe);
        }
      } catch (err) {
        console.error('Error fetching interactions:', err);
      }
    }
    return LOCAL_MEMORY.interactions;
  },

  async createInteraction(interaction) {
    if (isBackendOnline) {
      const body = {
        customerId: parseInt(interaction.customerId),
        employeeId: 3,
        type: interaction.type || 'call',
        content: interaction.content,
        notes: interaction.notes || ''
      };
      const response = await fetch(`${BASE_URL}/tuongtac`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const saved = await response.json();
        return mapInteractionToFe(saved);
      }
      throw new Error('Lỗi thêm lịch sử tương tác.');
    }

    const cust = LOCAL_MEMORY.customers.find(c => c.id === parseInt(interaction.customerId));
    const newId = Math.max(...LOCAL_MEMORY.interactions.map(i => i.id), 0) + 1;
    const newInter = {
      id: newId,
      customerId: parseInt(interaction.customerId),
      customerName: cust ? cust.name : 'Khách hàng',
      employeeId: 1,
      employeeName: 'Trần Minh Chiến',
      type: interaction.type || 'call',
      content: interaction.content,
      notes: interaction.notes || '',
      date: new Date().toISOString().substring(0, 19).replace('T', ' '),
      file: null
    };
    LOCAL_MEMORY.interactions.push(newInter);
    return newInter;
  },

  async updateInteraction(id, interaction) {
    if (isBackendOnline) {
      const body = {
        customerId: parseInt(interaction.customerId),
        employeeId: 3,
        type: interaction.type || 'call',
        content: interaction.content,
        notes: interaction.notes || ''
      };
      const response = await fetch(`${BASE_URL}/tuongtac/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const updated = await response.json();
        return mapInteractionToFe(updated);
      }
      throw new Error('Lỗi sửa lịch sử tương tác.');
    }
    const index = LOCAL_MEMORY.interactions.findIndex(i => i.id === id);
    if (index > -1) {
      LOCAL_MEMORY.interactions[index] = { ...LOCAL_MEMORY.interactions[index], ...interaction };
      return LOCAL_MEMORY.interactions[index];
    }
    throw new Error('Không tìm thấy tương tác mock.');
  },

  async deleteInteraction(id) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/tuongtac/${id}`, { method: 'DELETE' });
      return response.ok;
    }
    LOCAL_MEMORY.interactions = LOCAL_MEMORY.interactions.filter(i => i.id !== id);
    return true;
  },

  async uploadAttachment(interactionId, file) {
    if (isBackendOnline) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${BASE_URL}/tuongtac/${interactionId}/files`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const fileData = await response.json();
        return fileData; // Trả về { fileId, fileName, fileUrl }
      }
      throw new Error('Upload file thất bại.');
    }
    // Mock
    const inter = LOCAL_MEMORY.interactions.find(i => i.id === interactionId);
    if (inter) {
      const mockFile = { id: 99, fileName: file.name, fileUrl: '#' };
      inter.file = mockFile;
      return mockFile;
    }
    throw new Error('Không tìm thấy tương tác mock để đính kèm.');
  },

  async deleteAttachment(interactionId, fileId) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/tuongtac/${interactionId}/files/${fileId}`, { method: 'DELETE' });
      return response.ok;
    }
    const inter = LOCAL_MEMORY.interactions.find(i => i.id === interactionId);
    if (inter) {
      inter.file = null;
      return true;
    }
    return false;
  },

  // 6. CẤU HÌNH & BACKUP (HYBRID)
  async getConfig() {
    await checkBackendHealth();
    if (isBackendOnline) {
      try {
        const response = await fetch(`${BASE_URL}/cauhinh`);
        if (response.ok) {
          const cfg = await response.json();
          return cfg;
        }
      } catch (err) {
        console.error('Error fetching config:', err);
      }
    }
    return LOCAL_MEMORY.systemConfig;
  },

  async updateConfig(config) {
    if (isBackendOnline) {
      const response = await fetch(`${BASE_URL}/cauhinh`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) return await response.json();
      throw new Error('Lỗi cập nhật cấu hình hệ thống.');
    }
    LOCAL_MEMORY.systemConfig = { ...LOCAL_MEMORY.systemConfig, ...config };
    return LOCAL_MEMORY.systemConfig;
  },

  async downloadBackup() {
    if (isBackendOnline) {
      window.open(`${BASE_URL}/cauhinh/backup`, '_blank');
      return true;
    }
    // Mock
    const jsonStr = JSON.stringify(LOCAL_MEMORY, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_crm_mock_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  },

  async restoreBackup(file) {
    if (isBackendOnline) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${BASE_URL}/cauhinh/restore`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) return true;
      throw new Error('Restore CSDL thất bại!');
    }
    // Mock
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.customers) LOCAL_MEMORY.customers = data.customers;
          if (data.appointments) LOCAL_MEMORY.appointments = data.appointments;
          if (data.interactions) LOCAL_MEMORY.interactions = data.interactions;
          if (data.systemConfig) LOCAL_MEMORY.systemConfig = data.systemConfig;
          resolve(true);
        } catch (err) {
          reject(new Error('Định dạng file backup JSON không đúng!'));
        }
      };
      reader.readAsText(file);
    });
  }
};
