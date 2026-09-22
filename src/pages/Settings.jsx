import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Sliders,
  Moon,
  Sun,
  Shield,
  Bell,
  Database,
  Save,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, ROLES } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Input, Select } from '../components/common/FormControls';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { exportToCSV } from '../services/exportService';

export const Settings = () => {
  const { theme, toggleTheme, density, toggleDensity } = useTheme();
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('institution');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form states
  const [institutionForm, setInstitutionForm] = useState({
    bankName: 'Pragati Co-operative Urban Bank Ltd.',
    regNumber: 'OD-COP-2018-9921',
    rbiLicense: 'RBI/URB/2021/BBS-084',
    branchCode: 'BBS001',
    headOffice: 'Plot 104, Saheed Nagar, Janpath, Bhubaneswar - 751007, Odisha',
    supportEmail: 'operations@pragatibank.coop',
    helpline: '+91 674 2548900 / 1800-345-0988',
    financialYear: '01 April - 31 March',
    currency: 'INR (₹)'
  });

  const [bankingRules, setBankingRules] = useState({
    minSavingsBalance: '1000',
    savingsInterestRate: '4.50',
    rdInterestRate: '7.25',
    fdInterestRate: '8.10',
    seniorCitizenBonus: '0.50',
    maxLoanTenureMonths: '84',
    maxCashierTxnLimit: '200000',
    kycSlaHours: '24'
  });

  const [securityRules, setSecurityRules] = useState({
    sessionTimeoutMins: '30',
    enable2FA: true,
    maxLoginAttempts: '3',
    passwordExpiryDays: '60',
    restrictIpToBranch: false,
    auditTrailRetentionDays: '365'
  });

  const [notificationRules, setNotificationRules] = useState({
    smsOnDeposit: true,
    smsOnWithdrawal: true,
    emailDailyEODSummary: true,
    loanDueReminderDays: '3',
    kycStatusSms: true
  });

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Institution settings and banking parameters updated successfully!", "success");
    }, 400);
  };

  const handleExportBackup = () => {
    const backupData = [
      { Parameter: 'Institution Name', Value: institutionForm.bankName },
      { Parameter: 'Registration Number', Value: institutionForm.regNumber },
      { Parameter: 'RBI License', Value: institutionForm.rbiLicense },
      { Parameter: 'Min Savings Balance', Value: `₹${bankingRules.minSavingsBalance}` },
      { Parameter: 'Savings Interest Rate', Value: `${bankingRules.savingsInterestRate}%` },
      { Parameter: 'RD Interest Rate', Value: `${bankingRules.rdInterestRate}%` },
      { Parameter: 'FD Interest Rate', Value: `${bankingRules.fdInterestRate}%` },
      { Parameter: 'Cashier Limit', Value: `₹${bankingRules.maxCashierTxnLimit}` },
      { Parameter: 'Session Timeout', Value: `${securityRules.sessionTimeoutMins} mins` },
      { Parameter: 'Backup Timestamp', Value: new Date().toISOString() }
    ];
    exportToCSV(backupData, `bankadmin_system_backup_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast("Full system configuration backup downloaded.", "success");
  };

  const handleResetStorage = () => {
    setIsResetConfirmOpen(false);
    // Clear all bankadmin_ stored keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('bankadmin_') && key !== 'bankadmin_theme') {
        localStorage.removeItem(key);
      }
    });
    showToast("System database mock cache reset to factory default values! Refreshing...", "info");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const tabs = [
    { id: 'institution', label: 'Institution Profile', icon: Building },
    { id: 'rules', label: 'Banking Rules', icon: Sliders },
    { id: 'appearance', label: 'Appearance & Theme', icon: Sparkles },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Backup & Maintenance', icon: Database }
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={28} color="var(--primary-600)" /> System Settings & Preferences
          </h1>
          <p className="page-subtitle">Configure institutional profile, financial parameters, security policies, and UI settings.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSaveAll}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface-subtle)',
          overflowX: 'auto'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 20px',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--primary-600)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '24px' }}>
          {/* 1. Institution Profile */}
          {activeTab === 'institution' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Co-operative / Banking Institution Identity</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  These institutional details appear on printed receipts, member passbooks, account statements, and legal reports.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <Input
                  label="Institution Legal Name"
                  value={institutionForm.bankName}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, bankName: e.target.value })}
                  required
                />
                <Input
                  label="Co-operative Society Reg. Number"
                  value={institutionForm.regNumber}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, regNumber: e.target.value })}
                  required
                />
                <Input
                  label="RBI Authorization / License Ref"
                  value={institutionForm.rbiLicense}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, rbiLicense: e.target.value })}
                />
                <Input
                  label="Primary Branch Code"
                  value={institutionForm.branchCode}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, branchCode: e.target.value })}
                />
                <div style={{ gridColumn: 'span 2' }}>
                  <Input
                    label="Head Office Registered Address"
                    value={institutionForm.headOffice}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, headOffice: e.target.value })}
                  />
                </div>
                <Input
                  label="Operational Contact Email"
                  type="email"
                  value={institutionForm.supportEmail}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, supportEmail: e.target.value })}
                />
                <Input
                  label="Member Helpline / Phone"
                  value={institutionForm.helpline}
                  onChange={(e) => setInstitutionForm({ ...institutionForm, helpline: e.target.value })}
                />
                <Input
                  label="Financial Accounting Cycle"
                  value={institutionForm.financialYear}
                  disabled
                />
                <Input
                  label="Base Operational Currency"
                  value={institutionForm.currency}
                  disabled
                />
              </div>
            </div>
          )}

          {/* 2. Banking Rules */}
          {activeTab === 'rules' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Core Banking Business Parameters</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Define interest rates, minimum balances, deposit slabs, and cashier limits across account types.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <Input
                  label="Min. Balance for Savings (₹)"
                  type="number"
                  value={bankingRules.minSavingsBalance}
                  onChange={(e) => setBankingRules({ ...bankingRules, minSavingsBalance: e.target.value })}
                />
                <Input
                  label="Savings Account Interest Rate (% p.a.)"
                  type="number"
                  step="0.05"
                  value={bankingRules.savingsInterestRate}
                  onChange={(e) => setBankingRules({ ...bankingRules, savingsInterestRate: e.target.value })}
                />
                <Input
                  label="Standard RD Interest Rate (% p.a.)"
                  type="number"
                  step="0.05"
                  value={bankingRules.rdInterestRate}
                  onChange={(e) => setBankingRules({ ...bankingRules, rdInterestRate: e.target.value })}
                />
                <Input
                  label="Standard FD Interest Rate (% p.a.)"
                  type="number"
                  step="0.05"
                  value={bankingRules.fdInterestRate}
                  onChange={(e) => setBankingRules({ ...bankingRules, fdInterestRate: e.target.value })}
                />
                <Input
                  label="Senior Citizen Bonus Rate (% extra)"
                  type="number"
                  step="0.05"
                  value={bankingRules.seniorCitizenBonus}
                  onChange={(e) => setBankingRules({ ...bankingRules, seniorCitizenBonus: e.target.value })}
                />
                <Input
                  label="Max Loan Tenure (Months)"
                  type="number"
                  value={bankingRules.maxLoanTenureMonths}
                  onChange={(e) => setBankingRules({ ...bankingRules, maxLoanTenureMonths: e.target.value })}
                />
                <Input
                  label="Daily Cashier Single-Voucher Limit (₹)"
                  type="number"
                  value={bankingRules.maxCashierTxnLimit}
                  onChange={(e) => setBankingRules({ ...bankingRules, maxCashierTxnLimit: e.target.value })}
                />
                <Input
                  label="KYC Verification Target SLA (Hours)"
                  type="number"
                  value={bankingRules.kycSlaHours}
                  onChange={(e) => setBankingRules({ ...bankingRules, kycSlaHours: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* 3. Appearance & Theme */}
          {activeTab === 'appearance' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Display & Visual Experience</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Customize the interface theme, density, and accessibility preferences.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {/* Theme Selector Card */}
                <div style={{
                  padding: '18px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {theme === 'dark' ? <Moon size={20} color="#38bdf8" /> : <Sun size={20} color="#f59e0b" />}
                      <span style={{ fontWeight: 700 }}>Theme Mode</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)', textTransform: 'capitalize' }}>
                      {theme} Theme
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Switch between crisp light mode and high-contrast dark mode for low-light banking branch environments.
                  </p>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
                  </button>
                </div>

                {/* Density Selector Card */}
                <div style={{
                  padding: '18px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={20} color="var(--primary-600)" />
                      <span style={{ fontWeight: 700 }}>Table & Data Density</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)', textTransform: 'capitalize' }}>
                      {density} Density
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Compact density packs more ledger transactions and member rows onto a single screen for power cashiers.
                  </p>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                    onClick={toggleDensity}
                  >
                    {density === 'compact' ? '📄 Switch to Normal Density' : '📊 Switch to Compact Density'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Security & Auth */}
          {activeTab === 'security' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Access Control & Security Rules</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Protect customer financial records with administrative session timeouts and multi-factor verification policies.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <Select
                  label="Idle Session Auto-Timeout"
                  value={securityRules.sessionTimeoutMins}
                  onChange={(e) => setSecurityRules({ ...securityRules, sessionTimeoutMins: e.target.value })}
                  options={[
                    { value: '15', label: '15 Minutes' },
                    { value: '30', label: '30 Minutes (Recommended)' },
                    { value: '60', label: '60 Minutes' },
                    { value: '120', label: '2 Hours' }
                  ]}
                />
                <Select
                  label="Password Expiration Policy"
                  value={securityRules.passwordExpiryDays}
                  onChange={(e) => setSecurityRules({ ...securityRules, passwordExpiryDays: e.target.value })}
                  options={[
                    { value: '30', label: 'Every 30 Days' },
                    { value: '60', label: 'Every 60 Days' },
                    { value: '90', label: 'Every 90 Days' },
                    { value: '180', label: 'Every 180 Days' }
                  ]}
                />
                <Input
                  label="Max Failed Logins before Account Lock"
                  type="number"
                  value={securityRules.maxLoginAttempts}
                  onChange={(e) => setSecurityRules({ ...securityRules, maxLoginAttempts: e.target.value })}
                />
                <Input
                  label="Audit Log Retention (Days)"
                  type="number"
                  value={securityRules.auditTrailRetentionDays}
                  onChange={(e) => setSecurityRules({ ...securityRules, auditTrailRetentionDays: e.target.value })}
                />
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={securityRules.enable2FA}
                    onChange={(e) => setSecurityRules({ ...securityRules, enable2FA: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Enforce 2FA for Cashier Approvals & High-Value Transactions (&gt;₹50,000)</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requires OTP confirmation on mobile/hardware token before debit execution.</p>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={securityRules.restrictIpToBranch}
                    onChange={(e) => setSecurityRules({ ...securityRules, restrictIpToBranch: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Restrict Admin Portal Access to Branch Static IP Whitelist</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Blocks off-premise login attempts from unknown foreign networks.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 5. Notifications */}
          {activeTab === 'notifications' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Automated Customer & Staff Notifications</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Configure automatic SMS gateway alerts and daily end-of-day (EOD) accountant reports.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationRules.smsOnDeposit}
                    onChange={(e) => setNotificationRules({ ...notificationRules, smsOnDeposit: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Instant SMS on Cash Deposit (Savings / RD / FD)</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sends real-time SMS to registered member phone number with receipt reference.</p>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationRules.smsOnWithdrawal}
                    onChange={(e) => setNotificationRules({ ...notificationRules, smsOnWithdrawal: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Instant SMS on Account Debit / Withdrawal</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Alerts account holder immediately of any balance deduction.</p>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationRules.emailDailyEODSummary}
                    onChange={(e) => setNotificationRules({ ...notificationRules, emailDailyEODSummary: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email End-of-Day (EOD) Cash Balance to Branch Manager & Accountant</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated financial report dispatched daily at 18:30 IST.</p>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationRules.kycStatusSms}
                    onChange={(e) => setNotificationRules({ ...notificationRules, kycStatusSms: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>SMS Notification on KYC Verification Outcome (Approved / Rejected)</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Informs applicant once documents are reviewed by the compliance team.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 6. Backup & Maintenance */}
          {activeTab === 'data' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>System Data, Backups & Diagnostics</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Export snapshot archives or reset mock simulation data.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {/* Backup Card */}
                <div style={{
                  padding: '20px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Download size={20} color="var(--primary-600)" />
                    <span style={{ fontWeight: 700 }}>System Configuration Backup</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Download a full CSV snapshot containing all active banking rules, institution metadata, and security policies.
                  </p>
                  <button className="btn btn-primary" onClick={handleExportBackup} style={{ width: '100%' }}>
                    <Download size={16} style={{ marginRight: '6px' }} /> Download Backup CSV
                  </button>
                </div>

                {/* Reset Card */}
                <div style={{
                  padding: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <RefreshCw size={20} color="var(--status-danger)" />
                    <span style={{ fontWeight: 700, color: 'var(--status-danger-text)' }}>Reset Simulation Database</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Clears local browser modifications and restores initial 1,200+ mock records for members, savings, loans & accounting.
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => setIsResetConfirmOpen(true)}
                    style={{ width: '100%' }}
                  >
                    <RefreshCw size={16} style={{ marginRight: '6px' }} /> Factory Reset Demo Cache
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetStorage}
        title="Reset All Mock Data to Default?"
        message="This will clear all changes created during your current demo session (members added, loans approved, cashier vouchers, income/expense entries) and restore the default seed database."
        confirmText="Reset All Data"
        type="danger"
      />
    </div>
  );
};
