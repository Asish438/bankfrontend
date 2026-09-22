import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  User,
  KeyRound,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import { UserAvatar } from '../common/DisplayComponents';

export const Topbar = ({
  onToggleMobileSidebar,
  onOpenGlobalSearch,
  onOpenRoleModal,
  onOpenLogoutModal
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="topbar">
      {/* Topbar Left: Menu button + Search bar */}
      <div className="topbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div
          className="global-search-input-wrap"
          onClick={onOpenGlobalSearch}
          title="Search members, accounts, loans, etc."
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Search members, accounts, loans, etc..."
            readOnly
          />
          <span className="search-shortcut-badge">⌘K</span>
        </div>
      </div>

      {/* Topbar Right: Role Badge, Theme Toggle, Notification Bell, User Dropdown */}
      <div className="topbar-right">
        {/* Active Persona Switcher */}
        <button
          className="role-tag-badge"
          onClick={onOpenRoleModal}
          title="Click to change active role persona"
        >
          <ShieldCheck size={14} />
          <span>{currentUser.role}</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="icon-action-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-action-btn"
            onClick={() => setIsNotifOpen(prev => !prev)}
            title="Institutional Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-count-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        <div className="topbar-divider"></div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <button
            className="user-profile-btn"
            onClick={() => setIsProfileOpen(prev => !prev)}
            aria-expanded={isProfileOpen}
          >
            <UserAvatar
              name={currentUser.name}
              avatarUrl={currentUser.avatar}
              size={36}
            />
            <div className="user-meta-info">
              <span className="user-display-name">{currentUser.name}</span>
              <span className="user-display-role">{currentUser.role}</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isProfileOpen && (
            <div className="dropdown-menu">
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary-600)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={12} />
                  <span>{currentUser.branch}</span>
                </div>
              </div>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/settings?tab=profile');
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/settings?tab=security');
                }}
              >
                <KeyRound size={16} />
                <span>Change Password</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/settings');
                }}
              >
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item danger"
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenLogoutModal();
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
