import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/FormControls';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { formatINR } from '../../services/formatters';
import { CheckCircle2, XCircle } from 'lucide-react';

export const LoanApprovalModal = ({ isOpen, onClose, loan, onSuccess }) => {
  const [approvedAmount, setApprovedAmount] = useState(loan?.requestedAmount || '');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();

  React.useEffect(() => {
    if (loan) {
      setApprovedAmount(loan.requestedAmount);
    }
  }, [loan]);

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!approvedAmount || Number(approvedAmount) <= 0) {
      showToast("Please enter a valid approved amount.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.approveLoan(loan.loanId, approvedAmount, remarks);
      showToast(`Loan application ${loan.loanId} approved successfully for ${formatINR(approvedAmount)}!`, "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast("Error approving loan.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sanction & Approve Loan"
      subtitle={`Application #${loan.loanId} • ${loan.memberName}`}
      size="md"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleSubmit} disabled={isSubmitting}>
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Sanctioning...' : 'Approve & Sanction'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Loan Type</span>
            <span style={{ fontWeight: 600 }}>{loan.loanType}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Requested Principal</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{formatINR(loan.requestedAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Interest Rate & Tenure</span>
            <span style={{ fontWeight: 600 }}>{loan.interestRate}% p.a. ({loan.tenureMonths} Months)</span>
          </div>
        </div>

        <Input
          label="Sanctioned / Approved Amount (₹)"
          name="approvedAmount"
          type="number"
          value={approvedAmount}
          onChange={(e) => setApprovedAmount(e.target.value)}
          required
        />

        <div className="form-group">
          <label className="form-label">Sanction Remarks / Credit Committee Notes</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="e.g. CIBIL score verified, collateral papers clear, approved for full disbursement."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

export const LoanRejectModal = ({ isOpen, onClose, loan, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast("Please enter reason for rejection.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.rejectLoan(loan.loanId, reason);
      showToast(`Loan ${loan.loanId} rejected.`, "warning");
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast("Error rejecting loan.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Loan Application"
      subtitle={`Application #${loan.loanId} • ${loan.memberName}`}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleSubmit} disabled={isSubmitting}>
            <XCircle size={16} />
            <span>{isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Reason for Rejection <span className="required-star">*</span></label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="e.g. Insufficient debt-service coverage ratio, poor repayment history, or inadequate collateral value."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  );
};
