import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useNotifications } from '../../context/NotificationContext';

export const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { showToast } = useNotifications();

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    showToast("You have been successfully logged out from BankAdmin.", "info");
  };

  return (
    <div className="admin-layout">
      {/* Dark Navy Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onOpenGlobalSearch={() => setIsSearchModalOpen(true)}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        />

        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to end your current session and sign out of the BankAdmin Portal?"
        confirmText="Sign Out"
        type="danger"
      />
    </div>
  );
};
