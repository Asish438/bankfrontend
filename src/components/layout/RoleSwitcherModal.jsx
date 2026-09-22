import React from 'react';
import { Modal } from '../common/Modal';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Shield, Check, UserCheck, Calculator, Receipt, Wallet, Users, Key } from 'lucide-react';

export const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { currentUser, switchRole } = useAuth();

  const roleList = [
    {
      role: ROLES.SUPER_ADMIN,
      desc: "Full unrestricted access to all modules, administrative settings, and logs.",
      icon: Shield,
      color: "var(--primary-600)"
    },
    {
      role: ROLES.MANAGER,
      desc: "Branch operations oversight, member approvals, reports, and sanction audits.",
      icon: UserCheck,
      color: "var(--status-purple-text)"
    },
    {
      role: ROLES.ACCOUNTANT,
      desc: "Ledger books, income/expense entries, financial statements, and reports.",
      icon: Calculator,
      color: "var(--status-info-text)"
    },
    {
      role: ROLES.CASHIER,
      desc: "Daily cash drawers, deposit entries, withdrawals, and receipt generations.",
      icon: Receipt,
      color: "var(--status-success-text)"
    },
    {
      role: ROLES.LOAN_OFFICER,
      desc: "Loan origination, appraisal, EMI scheduling, and credit disbursement review.",
      icon: Wallet,
      color: "var(--status-warning-text)"
    },
    {
      role: ROLES.KYC_OFFICER,
      desc: "Identity proofs verification, Aadhaar/PAN compliance, and profile approvals.",
      icon: Users,
      color: "var(--primary-700)"
    }
  ];

  const handleSelectRole = (r) => {
    switchRole(r);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Active Persona / Role"
      subtitle="Experience the portal navigation and permissions from different institutional roles."
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {roleList.map((item) => {
          const isSelected = currentUser.role === item.role;
          const Icon = item.icon;
          return (
            <div
              key={item.role}
              onClick={() => handleSelectRole(item.role)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <Icon size={20} color={item.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.role}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
              {isSelected && (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
