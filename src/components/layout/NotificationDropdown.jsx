import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, Users, CreditCard, Landmark, Wallet, Receipt, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'kyc': return <Users size={16} color="var(--primary-600)" />;
      case 'loan': return <Wallet size={16} color="var(--status-danger)" />;
      case 'fd': return <Landmark size={16} color="var(--status-warning)" />;
      case 'cashier': return <Receipt size={16} color="var(--status-success)" />;
      default: return <Bell size={16} color="var(--primary-600)" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    onClose();
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="dropdown-menu"
      style={{
        width: '360px',
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        borderRadius: 'var(--radius-xl)'
      }}
    >
      {/* Dropdown Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              {unreadCount} New
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-600)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No new notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: n.read ? 'transparent' : 'var(--primary-50)',
                cursor: 'pointer',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-xs)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {getNotifIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.read ? 600 : 700, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '4px' }}>
                  {n.description}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  <span>{n.time}</span>
                </div>
              </div>
              {!n.read && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-600)',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 18px',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-subtle)',
          fontSize: '0.8rem'
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>BankAdmin Core Alert System</span>
      </div>
    </div>
  );
};
