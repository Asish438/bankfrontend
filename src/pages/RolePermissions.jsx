import React, { useState } from 'react';
import {
  CheckSquare,
  Shield,
  Save,
  Check,
  X,
  Info,
  Sliders,
  UserCheck
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const RolePermissions = () => {
  const { currentUser, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLES.MANAGER);
  const { showToast } = useNotifications();

  const modules = [
    { id: 'Dashboard', label: '1. Dashboard' },
    { id: 'Members', label: '2. Members & KYC' },
    { id: 'KYC', label: '3. KYC Verification Queue' },
    { id: 'Savings', label: '4. Savings Accounts' },
    { id: 'RD', label: '5. RD Management' },
    { id: 'FD', label: '6. FD Management' },
    { id: 'Loans', label: '7. Loan Management' },
    { id: 'Collection', label: '8. Cashier & Collection' },
    { id: 'Accounting', label: '9. Accounting & Ledgers' },
    { id: 'Reports', label: '10. Report Center' },
    { id: 'Staff', label: '11. Staff / Users' },
    { id: 'Security', label: '12. Security & Audit Logs' },
    { id: 'Settings', label: '13. Settings' }
  ];

  const permissions = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'];

  // Matrix state
  const [matrixState, setMatrixState] = useState({
    'Super Admin': { all: true },
    'Manager': {
      Dashboard: ['View', 'Export'],
      Members: ['View', 'Create', 'Edit', 'Export'],
      KYC: ['View', 'Approve', 'Export'],
      Savings: ['View', 'Create', 'Edit', 'Export'],
      RD: ['View', 'Create', 'Export'],
      FD: ['View', 'Create', 'Export'],
      Loans: ['View', 'Create', 'Approve', 'Export'],
      Collection: ['View', 'Export'],
      Accounting: ['View', 'Export'],
      Reports: ['View', 'Export'],
      Staff: ['View'],
      Security: ['View'],
      Settings: ['View', 'Edit']
    },
    'Accountant': {
      Dashboard: ['View'],
      Members: ['View'],
      Savings: ['View', 'Export'],
      RD: ['View', 'Export'],
      FD: ['View', 'Export'],
      Loans: ['View', 'Export'],
      Collection: ['View', 'Export'],
      Accounting: ['View', 'Create', 'Edit', 'Export'],
      Reports: ['View', 'Export'],
      Security: ['View']
    },
    'Cashier': {
      Dashboard: ['View'],
      Members: ['View'],
      Savings: ['View', 'Create'],
      RD: ['View', 'Create'],
      FD: ['View', 'Create'],
      Loans: ['View'],
      Collection: ['View', 'Create', 'Export'],
      Reports: ['View']
    },
    'Loan Officer': {
      Dashboard: ['View'],
      Members: ['View', 'Create'],
      Savings: ['View'],
      RD: ['View'],
      FD: ['View'],
      Loans: ['View', 'Create', 'Edit', 'Approve', 'Export'],
      Reports: ['View', 'Export']
    },
    'KYC Officer': {
      Dashboard: ['View'],
      Members: ['View', 'Edit'],
      KYC: ['View', 'Approve', 'Edit', 'Export'],
      Savings: ['View'],
      RD: ['View'],
      FD: ['View'],
      Loans: ['View'],
      Reports: ['View']
    },
    'Admin': {
      Dashboard: ['View', 'Export'],
      Members: ['View', 'Create', 'Edit', 'Export'],
      KYC: ['View', 'Approve', 'Export'],
      Savings: ['View', 'Create', 'Edit', 'Export'],
      RD: ['View', 'Create', 'Export'],
      FD: ['View', 'Create', 'Export'],
      Loans: ['View', 'Create', 'Approve', 'Export'],
      Collection: ['View', 'Export'],
      Accounting: ['View', 'Export'],
      Reports: ['View', 'Export'],
      Staff: ['View', 'Create', 'Edit'],
      Security: ['View', 'Export'],
      Settings: ['View', 'Edit']
    }
  });

  const togglePermission = (modId, perm) => {
    if (selectedRole === ROLES.SUPER_ADMIN) {
      showToast("Super Admin has unrestricted permissions across all modules.", "info");
      return;
    }

    setMatrixState(prev => {
      const currentRolePerms = { ...(prev[selectedRole] || {}) };
      const currentModPerms = currentRolePerms[modId] ? [...currentRolePerms[modId]] : [];

      if (currentModPerms.includes(perm)) {
        currentRolePerms[modId] = currentModPerms.filter(p => p !== perm);
      } else {
        currentRolePerms[modId] = [...currentModPerms, perm];
      }

      return {
        ...prev,
        [selectedRole]: currentRolePerms
      };
    });
  };

  const handleSaveMatrix = () => {
    showToast(`Access Control Policy for ${selectedRole} saved successfully!`, "success");
  };

  const isChecked = (modId, perm) => {
    if (selectedRole === ROLES.SUPER_ADMIN) return true;
    const rolePerms = matrixState[selectedRole];
    if (!rolePerms) return false;
    if (rolePerms.all) return true;
    return (rolePerms[modId] || []).includes(perm);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Role & Permission Control Matrix</h1>
          <p>Granular access control policies, institutional privileges, and API verb assignments.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSaveMatrix}>
            <Save size={16} />
            <span>Save Role Matrix</span>
          </button>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {Object.values(ROLES).map((r) => {
          const isSelected = selectedRole === r;
          return (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px' }}
            >
              <Shield size={15} />
              <span>{r}</span>
            </button>
          );
        })}
      </div>

      {/* Matrix Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <span>Policy Matrix for: </span>
              <span style={{ color: 'var(--primary-600)' }}>{selectedRole}</span>
            </h3>
            <p className="card-subtitle">Check verbs to grant administrative action permissions</p>
          </div>
          {selectedRole === currentUser.role ? (
            <span style={{ fontSize: '0.78rem', color: 'var(--status-success-text)', fontWeight: 700, backgroundColor: 'var(--status-success-bg)', padding: '4px 10px', borderRadius: '12px' }}>
              ✓ Currently Active Persona
            </span>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => switchRole(selectedRole)}>
              <UserCheck size={14} />
              <span>Simulate This Role</span>
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '280px' }}>Institutional Module</th>
                {permissions.map((p) => (
                  <th key={p} style={{ textAlign: 'center', width: '110px' }}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</td>
                  {permissions.map((p) => {
                    const checked = isChecked(m.id, p);
                    return (
                      <td key={p} style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => togglePermission(m.id, p)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: checked ? '1px solid var(--primary-600)' : '1px solid var(--border-strong)',
                            backgroundColor: checked ? 'var(--primary-600)' : 'var(--bg-surface)',
                            color: checked ? '#ffffff' : 'transparent',
                            cursor: selectedRole === ROLES.SUPER_ADMIN ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--transition-fast)'
                          }}
                          aria-label={`${p} for ${m.label}`}
                        >
                          <Check size={16} strokeWidth={3} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
