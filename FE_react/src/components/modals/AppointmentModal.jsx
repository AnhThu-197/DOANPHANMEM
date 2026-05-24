import React from 'react';

const AppointmentModal = ({
  isOpen,
  onClose,
  customers,
  apptForm,
  setApptForm,
  saveAppointment
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Lên lịch nhắc nhở Lịch hẹn mới</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={saveAppointment}>
          <div className="modal-body">
            <div className="form-group">
              <label>Chọn khách hàng *</label>
              <select className="form-control" required value={apptForm.customerId || ''} onChange={(e) => setApptForm({...apptForm, customerId: e.target.value})}>
                <option value="">-- Chọn khách hàng --</option>
                {customers.filter(c => !c.deleted).map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tiêu đề lịch nhắc *</label>
              <input type="text" className="form-control" required placeholder="VD: Gọi điện bàn giao tài liệu, Họp demo..." value={apptForm.title || ''} onChange={(e) => setApptForm({...apptForm, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Kênh nhắc nhở *</label>
              <select className="form-control" value={apptForm.type || 'call'} onChange={(e) => setApptForm({...apptForm, type: e.target.value})}>
                <option value="call">Gọi điện</option>
                <option value="email">Email</option>
                <option value="meeting">Cuộc họp trực tiếp</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Ngày hẹn *</label>
                <input type="date" className="form-control" required value={apptForm.date || ''} onChange={(e) => setApptForm({...apptForm, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Giờ hẹn *</label>
                <input type="time" className="form-control" required value={apptForm.time || ''} onChange={(e) => setApptForm({...apptForm, time: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Thời gian nhắc nhở trước (Phút)</label>
              <input type="number" className="form-control" value={apptForm.reminderBefore || 30} onChange={(e) => setApptForm({...apptForm, reminderBefore: parseInt(e.target.value) || 0})} />
            </div>
            <div className="form-group">
              <label>Mô tả chi tiết / Ghi chú</label>
              <textarea className="form-control" rows="3" value={apptForm.notes || ''} onChange={(e) => setApptForm({...apptForm, notes: e.target.value})}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#2B4856', color: 'white' }}>Lưu cuộc hẹn</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
