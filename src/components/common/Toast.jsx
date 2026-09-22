import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--status-success)" />;
      case 'error':
        return <AlertCircle size={18} color="var(--status-danger)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--status-warning)" />;
      default:
        return <Info size={18} color="var(--status-info)" />;
    }
  };

  return (
    <div className="toast-container" style={{ zIndex: 9999 }}>
      {toasts.map(toast => (
        <div key={toast.id} className="toast" role="alert">
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '2px'
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
