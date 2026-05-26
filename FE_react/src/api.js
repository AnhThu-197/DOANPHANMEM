// FE_react/src/api.js
// CẦU NỐI API - KẾT NỐI SPRING BOOT REST API VÀ MOCK HYBRID LOCAL STORAGE

const BASE_URL = "http://localhost:8082/api";

// Helper to get headers with JWT bearer token
function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const stored = localStorage.getItem("currentUser");

  if (stored) {
    try {
      const user = JSON.parse(stored);

      if (user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }

  return headers;
}

// Helper for multipart/form-data headers
function getUploadHeaders() {
  const headers = {};
  const stored = localStorage.getItem("currentUser");

  if (stored) {
    try {
      const user = JSON.parse(stored);

      if (user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }

  return headers;
}

// Quick health check on backend
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${BASE_URL}/v3/api-docs`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(id);

    return response.ok;
  } catch (error) {
    return false;
  }
}

// ======================
// MAPPERS
// ======================

function mapKhachHangToFe(kh) {
  if (!kh) return null;

  return {
    id: kh.maKhachHang,
    name: kh.hoTen,
    email: kh.email,
    phone: kh.soDienThoai,
    company: kh.congTy,

    status:
      kh.trangThaiKhach === "KH tiềm năng mới"
        ? "lead"
        : kh.trangThaiKhach === "KH triển vọng"
        ? "prospect"
        : kh.trangThaiKhach === "KH chính thức"
        ? "customer"
        : kh.trangThaiKhach === "KH trung thành"
        ? "evangelist"
        : "suspect",

    score: kh.diemTiemNang,
    trialStartDate: kh.ngayBatDauDungThu,
    trialDays: kh.soNgayDungThu,
    trialStatus: kh.trangThaiDungThu || "Chưa dùng thử",

    deleted: kh.daXoa || false,
    deleteReason: kh.lyDoXoa,
    deletedDate: kh.ngayXoa,

    createdDate: kh.ngayTao
      ? kh.ngayTao.substring(0, 10)
      : "",

    updatedDate: kh.ngayCapNhat
      ? kh.ngayCapNhat.substring(0, 10)
      : "",

    source:
      kh.maNguonKH === 1
        ? "facebook"
        : kh.maNguonKH === 2
        ? "google"
        : kh.maNguonKH === 3
        ? "direct"
        : kh.maNguonKH === 4
        ? "referral"
        : "website",

    industry:
      kh.maNganhNghe === 1
        ? "Công nghệ"
        : kh.maNganhNghe === 2
        ? "Bán lẻ"
        : "Dịch vụ",

    assignedTo: kh.maNguoiPhuTrach || 1,
  };
}

function mapKhachHangToBe(kh) {
  if (!kh) return null;

  let statusBe = "Suspect (Người truy cập)";

  if (kh.status === "lead") statusBe = "KH tiềm năng mới";
  else if (kh.status === "prospect") statusBe = "KH triển vọng";
  else if (kh.status === "customer") statusBe = "KH chính thức";
  else if (kh.status === "evangelist") statusBe = "KH trung thành";

  return {
    maKhachHang: kh.id || null,
    hoTen: kh.name || "",
    email: kh.email || "",
    soDienThoai: kh.phone || "",
    congTy: kh.company || "",
    trangThaiKhach: statusBe,
    diemTiemNang: kh.score !== undefined ? kh.score : 0,
    ngayBatDauDungThu: kh.trialStartDate || null,
    soNgayDungThu:
      kh.trialDays !== undefined
        ? parseInt(kh.trialDays)
        : 0,

    trangThaiDungThu:
      kh.trialStatus || "Chưa dùng thử",

    daXoa: kh.deleted || false,
    lyDoXoa: kh.deleteReason || null,

    maNguonKH:
      kh.source === "facebook"
        ? 1
        : kh.source === "google"
        ? 2
        : kh.source === "direct"
        ? 3
        : kh.source === "referral"
        ? 4
        : 5,

    maNganhNghe:
      kh.industry === "Công nghệ"
        ? 1
        : kh.industry === "Bán lẻ"
        ? 2
        : 3,
  };
}

// ======================
// LOCAL STORAGE INIT
// ======================

function initLocalStorage() {
  if (!localStorage.getItem("message_templates")) {
    const defaultTemplates = [
      {
        id: 1,
        name: "Chào mừng khách hàng mới",
        type: "email",
        content:
          "Xin chào {customerName}, chúng tôi rất vui được phục vụ bạn!",
        creatorId: 3,
        creatorName: "Trần Minh Chiến",
        useCount: 15,
      },
    ];

    localStorage.setItem(
      "message_templates",
      JSON.stringify(defaultTemplates)
    );
  }

  if (!localStorage.getItem("message_history")) {
    localStorage.setItem(
      "message_history",
      JSON.stringify([])
    );
  }

  if (!localStorage.getItem("interactions")) {
    localStorage.setItem(
      "interactions",
      JSON.stringify([])
    );
  }

  if (!localStorage.getItem("system_config")) {
    localStorage.setItem(
      "system_config",
      JSON.stringify({
        companyName: "CRM Nhóm 8",
      })
    );
  }
}

initLocalStorage();

// ======================
// CORE API
// ======================

export const API = {
  isOnline() {
    return true;
  },

  // ======================
  // AUTH
  // ======================

  async login(email, password) {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            matKhau: password,
          }),
        }
      );

      if (response.ok) {
        const resJson = await response.json();

        if (resJson.success && resJson.data) {
          const loginRes = resJson.data;

          const v = (
            loginRes.vaiTro || ""
          ).toLowerCase();

          const role =
            v.includes("admin") ||
            v.includes("quản trị")
              ? "admin"
              : v.includes("trưởng phòng")
              ? "manager"
              : "employee";

          const user = {
            id: loginRes.maTaiKhoan,
            username: loginRes.email || email,
            name: loginRes.hoTen,
            email: loginRes.email,
            role,
            token: loginRes.token,
          };

          localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
          );

          return {
            success: true,
            user,
          };
        }
      }

      return {
        success: false,
        message:
          "Tên đăng nhập hoặc mật khẩu không đúng",
      };
    } catch (e) {
      console.error("Login error", e);

      return {
        success: false,
        message:
          "Không thể kết nối đến máy chủ backend.",
      };
    }
  },

  async sendOtp(email) {
    const response = await fetch(
      `${BASE_URL}/auth/quen-mat-khau`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Gửi OTP thất bại! Vui lòng kiểm tra email."
      );
    }

    return true;
  },

  async verifyOtp(email, otp) {
    localStorage.setItem("forgot_otp_temp", otp);
    return true;
  },

  async resetPassword(email, newPassword) {
    const otp =
      localStorage.getItem("forgot_otp_temp") || "";

    const response = await fetch(
      `${BASE_URL}/auth/dat-lai-mat-khau`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          matKhauMoi: newPassword,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Đặt lại mật khẩu thất bại!"
      );
    }

    localStorage.removeItem("forgot_otp_temp");

    return true;
  },

  // ======================
  // CUSTOMERS
  // ======================

  async getCustomers() {
    const response = await fetch(
      `${BASE_URL}/khach-hang`,
      {
        headers: getHeaders(),
      }
    );

    if (response.ok) {
      const resJson = await response.json();

      return (resJson.data || []).map(
        mapKhachHangToFe
      );
    }

    throw new Error(
      "Không thể tải danh sách khách hàng."
    );
  },

  async createCustomer(customer) {
    const body = mapKhachHangToBe(customer);

    const response = await fetch(
      `${BASE_URL}/khach-hang`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const resJson = await response.json();

      return mapKhachHangToFe(resJson.data);
    }

    throw new Error("Lỗi thêm mới khách hàng.");
  },

  async updateCustomer(id, customer) {
    const body = mapKhachHangToBe(customer);

    const response = await fetch(
      `${BASE_URL}/khach-hang/${id}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const resJson = await response.json();

      return mapKhachHangToFe(resJson.data);
    }

    throw new Error(
      "Lỗi cập nhật khách hàng."
    );
  },

  async deleteCustomer(id) {
    const response = await fetch(
      `${BASE_URL}/khach-hang/${id}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    return response.ok;
  },
};