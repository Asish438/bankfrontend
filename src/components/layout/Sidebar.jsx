import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  Landmark,
  Wallet,
  Receipt,
  Calculator,
  FileSpreadsheet,
  UserCheck,
  ShieldAlert,
  Settings,
  LogOut,
  Building2,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile, onOpenLogoutModal }) => {
  const { currentUser, hasPermission } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, module: 'Dashboard' },
    { label: 'Members & KYC', path: '/members', icon: Users, module: 'Members' },
    { label: 'Savings Account', path: '/savings', icon: CreditCard, module: 'Savings' },
    { label: 'RD Management', path: '/rd', icon: PiggyBank, module: 'RD' },
    { label: 'FD Management', path: '/fd', icon: Landmark, module: 'FD' },
    { label: 'Loan Management', path: '/loans', icon: Wallet, module: 'Loans' },
    { label: 'Cashier & Collection', path: '/collections', icon: Receipt, module: 'Collection' },
    { label: 'Accounting', path: '/accounting', icon: Calculator, module: 'Accounting' },
    { label: 'Reports', path: '/reports', icon: FileSpreadsheet, module: 'Reports' },
    { label: 'Staff / Users', path: '/staff', icon: UserCheck, module: 'Staff' },
    { label: 'Security & Audit Logs', path: '/audit-logs', icon: ShieldAlert, module: 'Security' },
    { label: 'Settings', path: '/settings', icon: Settings, module: 'Settings' },
  ];

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile}></div>
      )}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-logo-icon">
            <Building2 size={24} />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-name">BankAdmin</span>
            <span className="brand-subtitle">Admin Portal</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="sidebar-nav-container">
          <div className="nav-section-label">Core Navigation</div>
          {menuItems.map((item) => {
            const isVisible = hasPermission(item.module, 'View');
            if (!isVisible) return null;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                <Icon className="nav-item-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: '12px' }}>Role Permissions</div>
          <NavLink
            to="/roles"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onCloseMobile}
          >
            <CheckSquare className="nav-item-icon" />
            <span>Role Matrix</span>
          </NavLink>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onOpenLogoutModal();
            }}
          >
            <LogOut size={18} />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
