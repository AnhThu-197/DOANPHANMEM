import React from 'react';

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  forgotStep,
  setForgotStep,
  forgotEmail,
  setForgotEmail,
  forgotOtp,
  setForgotOtp,
  forgotNewPassword,
  setForgotNewPassword,
  forgotConfirmPassword,
  setForgotConfirmPassword,
  forgotStatus,
  setForgotStatus,
  triggerSendOtp,
  triggerVerifyOtp,
  triggerResetPassword
}) => {
  if (!isOpen) return null;

  return (
    <div id="forgotPasswordModal" style={{ display: 'block', position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'auto' }}>
      <div style={{ backgroundColor: '#fefefe', margin: '8% auto', padding: 0, borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 15px 50px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #2B4856 0%, #3d5a6b 100%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'white' }}>
            <i className="fas fa-key"></i> Quên mật khẩu
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: 0, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.3s' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Progress Steps */}
        <div style={{ padding: '20px 25px 10px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
            <div id="progressLine" style={{ position: 'absolute', top: '15px', left: 0, height: '2px', background: '#2B4856', zIndex: 0, width: forgotStep === 1 ? '0%' : forgotStep === 2 ? '50%' : '100%', transition: 'width 0.3s' }}></div>
            
            <div style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
              <div id="step1Circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2B4856', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 600, fontSize: '14px', transition: 'all 0.3s' }}>1</div>
              <div style={{ fontSize: '11px', color: '#2B4856', fontWeight: 600 }}>Nhập Email</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
              <div id="step2Circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: forgotStep >= 2 ? '#2B4856' : '#e2e8f0', color: forgotStep >= 2 ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 600, fontSize: '14px', transition: 'all 0.3s' }}>2</div>
              <div id="step2Text" style={{ fontSize: '11px', color: forgotStep >= 2 ? '#2B4856' : '#94a3b8', fontWeight: 600 }}>Xác thực OTP</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
              <div id="step3Circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: forgotStep >= 3 ? '#2B4856' : '#e2e8f0', color: forgotStep >= 3 ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 600, fontSize: '14px', transition: 'all 0.3s' }}>3</div>
              <div id="step3Text" style={{ fontSize: '11px', color: forgotStep >= 3 ? '#2B4856' : '#94a3b8', fontWeight: 600 }}>Mật khẩu mới</div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '25px' }}>
          {forgotStatus && (
            <div style={{
              padding: '10px', background: forgotStatus.includes('Lỗi') ? '#fee2e2' : '#dcfce7',
              color: forgotStatus.includes('Lỗi') ? '#b91c1c' : '#15803d',
              borderRadius: '6px', fontSize: '12px', marginBottom: '14px', borderLeft: '3px solid'
            }}>
              {forgotStatus}
            </div>
          )}

          {/* Bước 1: Nhập Email */}
          {forgotStep === 1 && (
            <form onSubmit={triggerSendOtp}>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
                <i className="fas fa-info-circle" style={{ color: '#3b82f6' }}></i> Nhập email của bạn để nhận mã OTP xác thực.
              </p>
              <div className="form-group">
                <label htmlFor="resetEmail" style={{ display: 'block', marginBottom: '6px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>Email *</label>
                <input type="email" id="resetEmail" required style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', background: '#f8fafc' }} value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s' }}>
                  Hủy
                </button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#2B4856', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(43, 72, 86, 0.3)' }}>
                  <i className="fas fa-paper-plane"></i> Gửi mã OTP
                </button>
              </div>
            </form>
          )}
          
          {/* Bước 2: Nhập OTP */}
          {forgotStep === 2 && (
            <form onSubmit={triggerVerifyOtp}>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
                <i className="fas fa-envelope" style={{ color: '#10b981' }}></i> Mã OTP đã được gửi đến email: <strong>{forgotEmail}</strong>
              </p>
              <div className="form-group">
                <label htmlFor="otpCode" style={{ display: 'block', marginBottom: '6px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>Mã OTP (6 số) *</label>
                <input type="text" id="otpCode" required maxLength="6" placeholder="Nhập 6 số" style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '6px', fontSize: '18px', background: '#f8fafc', textAlign: 'center', letterSpacing: '8px', fontWeight: 600 }} value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} />
                <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '8px' }}>
                  Mã OTP có hiệu lực trong 5 phút. 
                  <a href="#" onClick={(e) => { e.preventDefault(); triggerSendOtp(e); }} style={{ color: '#2B4856', fontWeight: 600, textDecoration: 'none', marginLeft: '5px' }}>Gửi lại mã</a>
                </small>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setForgotStep(1)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s' }}>
                  <i className="fas fa-arrow-left"></i> Quay lại
                </button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#2B4856', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(43, 72, 86, 0.3)' }}>
                  <i className="fas fa-check"></i> Xác thực
                </button>
              </div>
            </form>
          )}
          
          {/* Bước 3: Đặt mật khẩu mới */}
          {forgotStep === 3 && (
            <form onSubmit={triggerResetPassword}>
              <p style={{ color: '#10b981', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5, background: '#dcfce7', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                <i className="fas fa-check-circle"></i> Xác thực thành công! Vui lòng đặt mật khẩu mới.
              </p>
              <div className="form-group">
                <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '6px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>Mật khẩu mới *</label>
                <input type="password" id="newPassword" required minLength="6" placeholder="Tối thiểu 6 ký tự" style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', background: '#f8fafc' }} value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginTop: '14px' }}>
                <label htmlFor="confirmNewPassword" style={{ display: 'block', marginBottom: '6px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>Xác nhận mật khẩu *</label>
                <input type="password" id="confirmNewPassword" required minLength="6" placeholder="Nhập lại mật khẩu" style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', background: '#f8fafc' }} value={forgotConfirmPassword} onChange={(e) => setForgotConfirmPassword(e.target.value)} />
              </div>
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '6px', marginTop: '14px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>Yêu cầu mật khẩu:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#64748b' }}>
                  <li>Tối thiểu 6 ký tự</li>
                  <li>Nên có chữ hoa, chữ thường và số</li>
                  <li>Không sử dụng mật khẩu dễ đoán</li>
                </ul>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s' }}>
                  Hủy
                </button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                  <i className="fas fa-save"></i> Đặt mật khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
