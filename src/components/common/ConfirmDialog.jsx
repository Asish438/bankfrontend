import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info' | 'success'
  isLoading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 size={24} color="var(--status-danger)" />;
      case 'warning':
        return <AlertTriangle size={24} color="var(--status-warning)" />;
      case 'success':
        return <CheckCircle2 size={24} color="var(--status-success)" />;
      default:
        return <Info size={24} color="var(--status-info)" />;
    }
  };

  const getBtnClass = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'warning': return 'btn-primary';
      case 'success': return 'btn-success';
      default: return 'btn-primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`btn ${getBtnClass()}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: type === 'danger' ? 'var(--status-danger-bg)' : 'var(--bg-surface-muted)',
            flexShrink: 0
          }}
        >
          {getIcon()}
        </div>
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};
