import React from 'react';

const CustomerModal = ({
  isOpen,
  onClose,
  editingCust,
  custForm,
  setCustForm,
  saveCustomer
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingCust ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách Hàng mới'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={saveCustomer}>
          <div className="modal-body">
            <div className="form-group">
              <label>Họ và Tên *</label>
              <input type="text" className="form-control" required value={custForm.name || ''} onChange={(e) => setCustForm({...custForm, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" className="form-control" required value={custForm.email || ''} onChange={(e) => setCustForm({...custForm, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input type="text" className="form-control" required value={custForm.phone || ''} onChange={(e) => setCustForm({...custForm, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Công ty *</label>
              <input type="text" className="form-control" required value={custForm.company || ''} onChange={(e) => setCustForm({...custForm, company: e.target.value})} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select className="form-control" required value={custForm.status || 'lead'} onChange={(e) => setCustForm({...custForm, status: e.target.value})}>
                  <option value="suspect">Suspect</option>
                  <option value="lead">Lead (Mới)</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="evangelist">Evangelist</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nguồn khách hàng</label>
                <select className="form-control" value={custForm.source || 'direct'} onChange={(e) => setCustForm({...custForm, source: e.target.value})}>
                  <option value="facebook">Facebook</option>
                  <option value="google">Google</option>
                  <option value="direct">Trực tiếp</option>
                  <option value="referral">Giới thiệu</option>
                  <option value="website">Website</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Ngành nghề</label>
                <input type="text" className="form-control" placeholder="VD: Công nghệ, Bán lẻ..." value={custForm.industry || ''} onChange={(e) => setCustForm({...custForm, industry: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Điểm tiềm năng (0 - 100)</label>
                <input type="number" min="0" max="100" className="form-control" value={custForm.score || 0} onChange={(e) => setCustForm({...custForm, score: parseInt(e.target.value) || 0})} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#2B4856', color: 'white' }}>Lưu khách hàng</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
