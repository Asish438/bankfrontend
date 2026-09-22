import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Page Imports
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { AddMember } from './pages/AddMember';
import { MemberDetails } from './pages/MemberDetails';
import { KYCManagement } from './pages/KYCManagement';
import { SavingsAccounts } from './pages/SavingsAccounts';
import { SavingsDetails } from './pages/SavingsDetails';
import { RDManagement } from './pages/RDManagement';
import { FDManagement } from './pages/FDManagement';
import { LoanManagement } from './pages/LoanManagement';
import { LoanDetails } from './pages/LoanDetails';
import { CashierCollection } from './pages/CashierCollection';
import { Accounting } from './pages/Accounting';
import { Reports } from './pages/Reports';
import { StaffUsers } from './pages/StaffUsers';
import { RolePermissions } from './pages/RolePermissions';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

// 404 Not Found Component
const NotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '24px'
  }}>
    <div style={{
      fontSize: '5rem',
      fontWeight: 800,
      color: 'var(--primary-600)',
      lineHeight: 1,
      marginBottom: '16px'
    }}>
      404
    </div>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '24px' }}>
      The banking resource or page you requested does not exist or has been moved.
    </p>
    <Link to="/dashboard" className="btn btn-primary">
      Return to Dashboard
    </Link>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="members/add" element={<AddMember />} />
        <Route path="members/:id" element={<MemberDetails />} />
        <Route path="kyc" element={<KYCManagement />} />
        <Route path="savings" element={<SavingsAccounts />} />
        <Route path="savings/:id" element={<SavingsDetails />} />
        <Route path="rd" element={<RDManagement />} />
        <Route path="fd" element={<FDManagement />} />
        <Route path="loans" element={<LoanManagement />} />
        <Route path="loans/:id" element={<LoanDetails />} />
        <Route path="collections" element={<CashierCollection />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="reports" element={<Reports />} />
        <Route path="staff" element={<StaffUsers />} />
        <Route path="roles" element={<RolePermissions />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
