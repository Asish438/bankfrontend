import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  FileText,
  Search,
  Building,
  FileSpreadsheet,
  Download,
  Printer
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatementPrintModal } from '../components/modals/PrintModals';
import { useNotifications } from '../context/NotificationContext';

export const SavingsAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [statementAccount, setStatementAccount] = useState(null);
  const [freezeAccount, setFreezeAccount] = useState(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSavingsAccounts();
      setAccounts(res);
      setFilteredAccounts(res);
    } catch (err) {
      console.error(err);
      showToast("Unable to fetch savings accounts.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    let result = [...accounts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.accountNumber.toLowerCase().includes(q) ||
          a.memberName.toLowerCase().includes(q) ||
          a.memberId.toLowerCase().includes(q) ||
          a.mobile.includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(a => a.status === statusFilter);
    }

    setFilteredAccounts(result);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, accounts]);

  const totalCount = accounts.length;
  const activeCount = accounts.filter(a => a.status === 'Active').length;
  const frozenCount = accounts.filter(a => a.status === 'Frozen').length;
  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const handleToggleFreeze = async () => {
    if (!freezeAccount) return;
    try {
      const updated = await api.toggleAccountFreeze(freezeAccount.accountNumber);
      showToast(`Account ${updated.accountNumber} status updated to ${updated.status}.`, "success");
      setFreezeAccount(null);
      loadAccounts();
    } catch (e) {
      showToast("Error updating account state.", "error");
    }
  };

  const handleOpenStatement = async (account) => {
    try {
      const fullAcc = await api.getSavingsById(account.accountNumber);
      setStatementAccount(fullAcc);
    } catch (e) {
      showToast("Could not load account statement.", "error");
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredAccounts.map(a => ({
      "Account Number": a.accountNumber,
      "Member ID": a.memberId,
      "Member Name": a.memberName,
      "Opening Date": a.openingDate,
      "Balance (INR)": a.balance,
      "Interest Rate": `${a.interestRate}%`,
      "Status": a.status,
      "Branch": a.branch
    }));
    exportToExcel(exportData, `Savings_Accounts_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Savings ledger exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredAccounts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'Account Number',
      key: 'accountNumber',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{val}</span>
    },
    {
      header: 'Member Name',
      key: 'memberName',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID: {row.memberId} • {row.mobile}</div>
        </div>
      )
    },
    {
      header: 'Opening Date',
      key: 'openingDate',
      render: (val) => formatDate(val)
    },
    {
      header: 'Balance',
      key: 'balance',
      render: (val) => (
        <span style={{ fontWeight: 800, color: 'var(--status-success-text)', fontSize: '0.95rem' }}>
          {formatINR(val)}
        </span>
      )
    },
    {
      header: 'Interest Rate',
      key: 'interestRate',
      render: (val) => `${val}% p.a.`
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Actions',
      key: 'accountNumber',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/savings/${val}`)}
            title="View Account Ledger"
            style={{ padding: '5px 8px' }}
          >
            <Eye size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenStatement(row)}
            title="View Statement & Print"
            style={{ padding: '5px 8px' }}
          >
            <FileText size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setFreezeAccount(row)}
            title={row.status === 'Active' ? 'Freeze Account' : 'Unfreeze Account'}
            style={{ padding: '5px 8px', color: row.status === 'Active' ? 'var(--status-danger)' : 'var(--status-success-text)' }}
          >
            {row.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Savings Accounts</h1>
          <p>Demand deposit accounts, balances, liquidity ledger, and interest schedules.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics KPI Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Accounts"
          value={totalCount}
          icon={CreditCard}
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          trend="↑ 15%"
          trendType="positive"
        />
        <StatCard
          title="Active Accounts"
          value={activeCount}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="Regular operations"
          trendType="positive"
        />
        <StatCard
          title="Frozen Accounts"
          value={frozenCount}
          icon={Lock}
          iconColor="#ef4444"
          iconBg="rgba(239, 68, 68, 0.12)"
          trend="Requires review"
          trendType="negative"
        />
        <StatCard
          title="Total Balance"
          value={formatINR(totalBalance)}
          icon={CreditCard}
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.14)"
          trend="Aggregate deposit"
          trendType="positive"
        />
      </div>

      {/* Search & Filter Card */}
      <div className="card">
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search account number, member name or ID..."
            width="340px"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Frozen">Frozen</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <SkeletonTable rows={8} cols={7} />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              keyField="accountNumber"
              emptyMessage="No savings accounts found."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredAccounts.length / pageSize)}
              totalItems={filteredAccounts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Statement Print Modal */}
      <StatementPrintModal
        isOpen={Boolean(statementAccount)}
        onClose={() => setStatementAccount(null)}
        account={statementAccount}
      />

      {/* Freeze / Unfreeze Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(freezeAccount)}
        onClose={() => setFreezeAccount(null)}
        onConfirm={handleToggleFreeze}
        title={freezeAccount?.status === 'Active' ? 'Freeze Savings Account' : 'Reactivate Savings Account'}
        message={`Are you sure you want to change status for account ${freezeAccount?.accountNumber} (${freezeAccount?.memberName}) to ${freezeAccount?.status === 'Active' ? 'Frozen' : 'Active'}?`}
        confirmText={freezeAccount?.status === 'Active' ? 'Freeze Account' : 'Activate Account'}
        type={freezeAccount?.status === 'Active' ? 'danger' : 'success'}
      />
    </div>
  );
};
