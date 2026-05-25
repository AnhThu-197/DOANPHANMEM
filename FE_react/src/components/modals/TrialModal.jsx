import React from 'react';

const TrialModal = ({
  isOpen,
  onClose,
  customers,
  selectedTrialCust,
  trialForm,
  setTrialForm,
  trialDetails,
  saveTrial
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>{selectedTrialCust ? 'Cấu hình dùng thử sản phẩm' : 'Thêm dùng thử'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={saveTrial}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {selectedTrialCust ? (
              <>
                <p style={{ marginBottom: '15px' }}>Khách hàng: <strong>{selectedTrialCust.name}</strong></p>
                {trialDetails && (
                  <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px', color: '#475569', marginBottom: '15px' }}>
                    <p><i className="fas fa-clock"></i> Số ngày dùng thử còn lại: <strong style={{ color: '#1e40af' }}>{trialDetails.remainingDays} ngày</strong> (Giải quyết qua F01 của CSDL)</p>
                  </div>
                )}
              </>
            ) : (
              <div className="form-group">
                <label>Khách hàng nhận dùng thử *</label>
                <select className="form-control" required value={trialForm.customerId || ''} onChange={(e) => {
                  const custId = parseInt(e.target.value);
                  const cust = customers.find(c => c.id === custId);
                  if (cust) {
                    const storedExtra = localStorage.getItem(`trial_extra_${cust.id}`);
                    const extra = storedExtra ? JSON.parse(storedExtra) : {
                      reminderDays: 3,
                      reminderEmail: '',
                      notes: '',
                      feature1: true,
                      feature2: true,
                      support1: true,
                      support2: false
                    };
                    setTrialForm({
                      customerId: cust.id,
                      startDate: cust.trialStartDate || new Date().toISOString().substring(0, 10),
                      durationDays: cust.trialDays || 30,
                      status: cust.trialStatus || 'Đang dùng thử',
                      reminderDays: extra.reminderDays,
                      reminderEmail: extra.reminderEmail,
                      notes: extra.notes,
                      feature1: extra.feature1,
                      feature2: extra.feature2,
                      support1: extra.support1,
                      support2: extra.support2
                    });
                  } else {
                    setTrialForm({
                      customerId: '',
                      startDate: new Date().toISOString().substring(0, 10),
                      durationDays: 30,
                      status: 'Đang dùng thử',
                      reminderDays: 3,
                      reminderEmail: '',
                      notes: '',
                      feature1: true,
                      feature2: true,
                      support1: true,
                      support2: false
                    });
                  }
                }}>
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.filter(c => !c.deleted).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Ngày bắt đầu dùng thử *</label>
                <input type="date" className="form-control" required value={trialForm.startDate || ''} onChange={(e) => setTrialForm({...trialForm, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Số ngày dùng thử sản phẩm *</label>
                <input type="number" min="1" className="form-control" required value={trialForm.durationDays || 30} onChange={(e) => setTrialForm({...trialForm, durationDays: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            {(() => {
              let calculatedEndDate = '-';
              let calculatedRemaining = '-';
              if (trialForm.startDate && trialForm.durationDays) {
                const start = new Date(trialForm.startDate);
                const end = new Date(start.getTime() + trialForm.durationDays * 24 * 60 * 60 * 1000);
                calculatedEndDate = end.toISOString().split('T')[0];
                const today = new Date();
                const diffTime = end - today;
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                calculatedRemaining = daysLeft > 0 ? `${daysLeft} ngày` : '0 ngày (Hết hạn)';
              }
              return (
                <div style={{ background: '#f1f5f9', padding: '15px', borderLeft: '4px solid #2B4856', borderRadius: '8px', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Ngày Kết thúc dự kiến:</strong> <span>{calculatedEndDate}</span></p>
                  <p style={{ margin: 0 }}><strong>Thời gian Còn lại:</strong> <span>{calculatedRemaining}</span></p>
                </div>
              );
            })()}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Nhắc nhở trước (ngày)</label>
                <input type="number" className="form-control" min="1" value={trialForm.reminderDays || 3} onChange={(e) => setTrialForm({...trialForm, reminderDays: parseInt(e.target.value) || 0})} />
              </div>
              <div className="form-group">
                <label>Email Nhắc nhở</label>
                <input type="email" className="form-control" placeholder="Để trống = dùng email khách hàng" value={trialForm.reminderEmail || ''} onChange={(e) => setTrialForm({...trialForm, reminderEmail: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Ghi chú dùng thử</label>
              <textarea className="form-control" rows="2" placeholder="Ghi chú về dùng thử..." value={trialForm.notes || ''} onChange={(e) => setTrialForm({...trialForm, notes: e.target.value})}></textarea>
            </div>

            <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#92400e' }}>Thông tin Dùng thử bổ sung</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '13px' }}>Tính năng:</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={trialForm.feature1 ?? true} onChange={(e) => setTrialForm({...trialForm, feature1: e.target.checked})} />
                    <span>Tính năng cơ bản</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>
                    <input type="checkbox" checked={trialForm.feature2 ?? true} onChange={(e) => setTrialForm({...trialForm, feature2: e.target.checked})} />
                    <span>Tính năng nâng cao</span>
                  </label>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '13px' }}>Hỗ trợ:</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={trialForm.support1 ?? true} onChange={(e) => setTrialForm({...trialForm, support1: e.target.checked})} />
                    <span>Email support</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>
                    <input type="checkbox" checked={trialForm.support2 ?? false} onChange={(e) => setTrialForm({...trialForm, support2: e.target.checked})} />
                    <span>Phone support</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Trạng thái dùng thử</label>
              <select className="form-control" value={trialForm.status || 'Đang dùng thử'} onChange={(e) => setTrialForm({...trialForm, status: e.target.value})}>
                <option value="Chưa dùng thử">Chưa dùng thử</option>
                <option value="Đang dùng thử">Đang dùng thử</option>
                <option value="Hết hạn dùng thử">Hết hạn dùng thử</option>
                <option value="Đã chuyển đổi">Đã chuyển đổi</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#2B4856', color: 'white' }}>Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrialModal;
