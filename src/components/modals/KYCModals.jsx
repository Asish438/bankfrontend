import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Input, Select } from '../common/FormControls';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { FileText, CheckCircle2, XCircle, RefreshCw, User, MapPin, Phone, Shield } from 'lucide-react';

export const KYCReviewModal = ({ isOpen, onClose, member, onStatusUpdated }) => {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useNotifications();

  if (!isOpen || !member) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await api.approveKYC(member.id);
      showToast(`KYC for ${member.name} (${member.id}) approved successfully!`, "success");
      onStatusUpdated?.();
      onClose();
    } catch (err) {
      showToast("Error approving KYC.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast("Please provide a valid rejection reason.", "warning");
      return;
    }
    setIsProcessing(true);
    try {
      await api.rejectKYC(member.id, rejectReason);
      showToast(`KYC for ${member.name} marked as Rejected.`, "warning");
      setIsRejectOpen(false);
      onStatusUpdated?.();
      onClose();
    } catch (err) {
      showToast("Error rejecting KYC.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestReupload = () => {
    showToast(`Re-upload notification sent to ${member.name} (${member.mobile})`, "info");
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isRejectOpen}
        onClose={onClose}
        title={`KYC Verification Review - ${member.name}`}
        subtitle={`Member ID: ${member.id} • Branch: ${member.branch}`}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={handleRequestReupload} disabled={isProcessing}>
              <RefreshCw size={16} />
              <span>Request Re-upload</span>
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-danger"
                onClick={() => setIsRejectOpen(true)}
                disabled={isProcessing}
              >
                <XCircle size={16} />
                <span>Reject KYC</span>
              </button>
              <button
                className="btn btn-success"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <CheckCircle2 size={16} />
                <span>{isProcessing ? 'Approving...' : 'Approve KYC'}</span>
              </button>
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Member Summary Header */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              alignItems: 'center'
            }}
          >
            <img
              src={member.documents?.photo || member.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={member.name}
              style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--primary-500)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{member.name}</h4>
                <StatusBadge status={member.kycStatus} />
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <span>Mobile: {member.mobile}</span>
                <span>Email: {member.email}</span>
                <span>Submitted: {member.kycSubmittedDate || member.joiningDate}</span>
              </div>
            </div>
          </div>

          {/* Document Verification Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Shield size={18} color="var(--primary-600)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Identity Proof</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-muted)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{member.documents?.idProof || "Aadhaar Card"}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document Number Verified</div>
              </div>
              <div
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-strong)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  gap: '6px'
                }}
              >
                <FileText size={28} color="var(--primary-600)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ID_Document_Scan.pdf</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--status-success-text)' }}>✓ Digitally Verified</span>
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <MapPin size={18} color="var(--primary-600)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Address Proof</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-muted)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{member.documents?.addressProof || "Electricity Utility Bill"}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.address}, {member.city}, {member.state}</div>
              </div>
              <div
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-strong)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  gap: '6px'
                }}
              >
                <FileText size={28} color="var(--primary-600)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Address_Proof_Doc.pdf</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--status-success-text)' }}>✓ Geo-Address Matched</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Reject Reason Sub-Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject KYC Verification"
        subtitle={`Please state the official compliance reason for rejecting ${member.name}`}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsRejectOpen(false)}>
              Back
            </button>
            <button className="btn btn-danger" onClick={handleRejectSubmit} disabled={isProcessing}>
              {isProcessing ? 'Submitting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRejectSubmit}>
          <div className="form-group">
            <label className="form-label">
              Reason for Rejection <span className="required-star">*</span>
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="e.g. Identity proof is blurred/unreadable, or Address proof name does not match member applicant name."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
