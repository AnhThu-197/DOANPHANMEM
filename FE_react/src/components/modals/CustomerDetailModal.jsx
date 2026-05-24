import React from 'react';

const CustomerDetailModal = ({
  isOpen,
  onClose,
  selectedDetailCust,
  custDetailSubTab,
  setCustDetailSubTab,
  interactions,
  handleStartEditInter,
  handleDeleteInter,
  handleUploadFile,
  handleDeleteFile,
  uploadingFile,
  setInterForm,
  setSelectedFilesForInter,
  setEditingInter,
  setShowInteractionModal
}) => {
  if (!isOpen || !selectedDetailCust) return null;

  const getStatusLabel = (status) => {
    const labels = {
      'suspect': 'Suspect',
      'lead': 'Lead',
      'prospect': 'Prospect',
      'customer': 'Customer',
      'evangelist': 'Evangelist'
    };
    return labels[status] || status;
  };

  const getSourceLabel = (src) => {
    const labels = {
      'facebook': 'Facebook',
      'google': 'Google',
      'direct': 'Trực tiếp',
      'referral': 'Giới thiệu',
      'website': 'Website'
    };
    return labels[src] || src;
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header">
          <h2>Chi tiết Khách hàng: {selectedDetailCust.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        
        <div className="tabs" style={{ margin: 0, padding: '0 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button className={`tab-btn ${custDetailSubTab === 'detail-info' ? 'active' : ''}`} onClick={() => setCustDetailSubTab('detail-info')}>Thông tin chi tiết</button>
          <button className={`tab-btn ${custDetailSubTab === 'detail-interactions' ? 'active' : ''}`} onClick={() => setCustDetailSubTab('detail-interactions')}>Lịch sử tương tác</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {custDetailSubTab === 'detail-info' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <p><strong>Họ và tên:</strong> {selectedDetailCust.name}</p>
                <p><strong>Email:</strong> {selectedDetailCust.email}</p>
                <p><strong>Số điện thoại:</strong> {selectedDetailCust.phone}</p>
                <p><strong>Công ty:</strong> {selectedDetailCust.company}</p>
                <p><strong>Nguồn gốc:</strong> <span className="status lead">{getSourceLabel(selectedDetailCust.source)}</span></p>
                <p><strong>Ngành nghề:</strong> {selectedDetailCust.industry}</p>
                <p><strong>Cấp độ tiềm năng:</strong> <span className={`status ${selectedDetailCust.status}`}>{getStatusLabel(selectedDetailCust.status)}</span></p>
                <p><strong>Điểm số:</strong> <strong>{selectedDetailCust.score} / 100</strong></p>
                <p><strong>Ngày tạo record:</strong> {selectedDetailCust.createdDate}</p>
              </div>
            </div>
          )}

          {custDetailSubTab === 'detail-interactions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4>Nhật ký Tương tác</h4>
                <button className="btn btn-primary" onClick={() => { setInterForm({ customerId: selectedDetailCust.id, type: 'call', content: '', notes: '' }); setSelectedFilesForInter([]); setEditingInter(null); setShowInteractionModal(true); }} style={{ background: '#2B4856', color: 'white', padding: '6px 12px', fontSize: '12px' }}>+ Thêm tương tác</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {interactions.filter(i => i.customerId === selectedDetailCust.id).map(inter => (
                  <div key={inter.id} style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <span className={`status ${inter.type}`}>{inter.type === 'call' ? 'Gọi điện' : inter.type === 'email' ? 'Email' : inter.type === 'meeting' ? 'Cuộc họp' : 'Tin nhắn'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <small style={{ color: '#64748b' }}>{inter.date} - Bởi {inter.employeeName || 'Admin'}</small>
                        <button 
                          onClick={() => handleStartEditInter(inter)}
                          title="Sửa tương tác"
                          style={{ background: 'none', border: 'none', color: '#2B4856', cursor: 'pointer', padding: '2px', fontSize: '12px' }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteInter(inter.id)}
                          title="Xóa tương tác"
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', fontSize: '12px' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: '5px 0' }}><strong>Nội dung:</strong> {inter.content}</p>
                    {inter.notes && <p style={{ margin: '5px 0', fontSize: '13px', color: '#64748b' }}><strong>Ghi chú:</strong> {inter.notes}</p>}
                    
                    {/* TepDinhKem Attachment Section */}
                    <div style={{ marginTop: '10px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}><i className="fas fa-paperclip"></i> Tệp đính kèm:</span>
                        <div>
                          <input type="file" id={`file-upload-${inter.id}`} style={{ display: 'none' }} multiple onChange={(e) => handleUploadFile(e, inter.id)} />
                          <label htmlFor={`file-upload-${inter.id}`} style={{ fontSize: '11px', background: '#e2e8f0', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {uploadingFile[inter.id] ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>} Upload tệp
                          </label>
                        </div>
                      </div>

                      {inter.attachments && inter.attachments.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                          {inter.attachments.map(att => (
                            <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <i className="far fa-file" style={{ color: '#2B4856', fontSize: '16px' }}></i>
                              <a href={att.fileUrl || '#'} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2B4856', textDecoration: 'none', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                                {att.fileName}
                              </a>
                              <button onClick={() => handleDeleteFile(inter.id, att.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fas fa-trash"></i></button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>Chưa đính kèm tài liệu.</p>
                      )}
                    </div>
                  </div>
                ))}
                {interactions.filter(i => i.customerId === selectedDetailCust.id).length === 0 && (
                  <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>Chưa có lịch sử tương tác nào.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
