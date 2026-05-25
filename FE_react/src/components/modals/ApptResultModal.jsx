import React from 'react';

const ApptResultModal = ({
  isOpen,
  onClose,
  selectedAppt,
  apptResultForm,
  setApptResultForm,
  saveApptResult
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2>Ghi nhận Kết quả Lịch hẹn</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={saveApptResult}>
          <div className="modal-body">
            <div className="form-group">
              <label>Đánh giá kết quả cuộc hẹn</label>
              <select className="form-control" value={apptResultForm.result || 'success'} onChange={(e) => setApptResultForm({...apptResultForm, result: e.target.value})}>
                <option value="success">Thành công</option>
                <option value="busy">Khách bận hẹn lại</option>
                <option value="refused">Khách hàng từ chối</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ghi chú kết quả chi tiết *</label>
              <textarea className="form-control" required rows="3" placeholder="Nhập ghi nhận chi tiết sau khi trao đổi..." value={apptResultForm.resultNotes || ''} onChange={(e) => setApptResultForm({...apptResultForm, resultNotes: e.target.value})}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#2B4856', color: 'white' }}>Lưu kết quả</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApptResultModal;
