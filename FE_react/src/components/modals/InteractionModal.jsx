import React from 'react';

const InteractionModal = ({
  isOpen,
  onClose,
  customers,
  selectedDetailCust,
  editingInter,
  interForm,
  setInterForm,
  selectedFilesForInter,
  setSelectedFilesForInter,
  saveInteraction
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2>{editingInter ? 'Sửa lịch sử tương tác' : 'Thêm Lịch sử tương tác mới'}</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={saveInteraction}>
          <div className="modal-body">
            <div className="form-group">
              <label>Khách hàng tương tác *</label>
              {selectedDetailCust ? (
                <input 
                  type="text" 
                  className="form-control" 
                  value={selectedDetailCust.name || ''} 
                  disabled 
                  style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#475569', fontWeight: '600' }}
                />
              ) : (
                <select className="form-control" required value={interForm.customerId || ''} onChange={(e) => setInterForm({...interForm, customerId: e.target.value})}>
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.filter(c => !c.deleted).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Hình thức tương tác *</label>
              <select className="form-control" value={interForm.type || 'call'} onChange={(e) => setInterForm({...interForm, type: e.target.value})}>
                <option value="call">Gọi điện</option>
                <option value="email">Email</option>
                <option value="meeting">Cuộc họp trực tiếp</option>
                <option value="message">Tin nhắn</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nội dung thảo luận *</label>
              <textarea className="form-control" rows="3" required placeholder="Ghi nhận nội dung thảo luận..." value={interForm.content || ''} onChange={(e) => setInterForm({...interForm, content: e.target.value})}></textarea>
            </div>
            <div className="form-group">
              <label>Ghi chú thêm</label>
              <textarea className="form-control" rows="2" placeholder="Ghi chú nếu có..." value={interForm.notes || ''} onChange={(e) => setInterForm({...interForm, notes: e.target.value})}></textarea>
            </div>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label><i className="fas fa-paperclip" style={{ marginRight: '6px', color: '#64748b' }}></i> Tệp đính kèm (Tùy chọn)</label>
              <input type="file" className="form-control" multiple onChange={(e) => setSelectedFilesForInter(Array.from(e.target.files))} style={{ padding: '6px' }} />
              {selectedFilesForInter && selectedFilesForInter.length > 0 && (
                <div style={{ marginTop: '5px', fontSize: '11px', color: '#10b981', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedFilesForInter.map((file, idx) => (
                    <div key={idx}><i className="fas fa-check-circle"></i> Sẵn sàng đính kèm: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#2B4856', color: 'white' }}>Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InteractionModal;
