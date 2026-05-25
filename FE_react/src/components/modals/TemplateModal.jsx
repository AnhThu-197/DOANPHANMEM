import React from 'react';

const TemplateModal = ({
  isOpen,
  onClose,
  editingTemplate,
  templateForm,
  setTemplateForm,
  saveTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingTemplate ? 'Chỉnh sửa mẫu' : 'Thêm mẫu thông điệp mới'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={saveTemplate}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tên / Tiêu đề mẫu *</label>
              <input type="text" className="form-control" required placeholder="VD: Khuyến mãi mùa hè, Chào mừng khách..." value={templateForm.name || ''} onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Kênh Marketing</label>
              <select className="form-control" value={templateForm.type || 'email'} onChange={(e) => setTemplateForm({...templateForm, type: e.target.value})}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="zalo">Zalo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nội dung mẫu thông điệp *</label>
              <textarea className="form-control" rows="5" required placeholder="Nhập nội dung mẫu (hỗ trợ tag {customerName} để chèn tên động)..." value={templateForm.content || ''} onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#2B4856', color: 'white' }}>Lưu mẫu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;
