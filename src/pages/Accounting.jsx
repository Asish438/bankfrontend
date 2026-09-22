import React, { useState, useEffect } from 'react';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Building,
  Wallet,
  Plus,
  FileSpreadsheet,
  Calendar,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Tabs } from '../components/common/FormControls';
import { AddIncomeModal, AddExpenseModal } from '../components/modals/AccountingModals';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { useNotifications } from '../context/NotificationContext';

export const Accounting = () => {
  const [accountingData, setAccountingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { showToast } = useNotifications();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAccountingData();
      setAccountingData(res);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch accounting ledgers.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading || !accountingData) {
    return (
      <div>
        <SkeletonCard count={4} />
        <SkeletonTable rows={6} cols={7} />
      </div>
    );
  }

  const { summary, transactions } = accountingData;

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'income') return t.type === 'Income';
    if (activeTab === 'expenses') return t.type === 'Expense';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Transactions', badge: transactions.length },
    { id: 'income', label: 'Income Records', badge: transactions.filter(t => t.type === 'Income').length },
    { id: 'expenses', label: 'Operating Expenses', badge: transactions.filter(t => t.type === 'Expense').length },
    { id: 'ledger', label: 'General Ledger' }
  ];

  const handleExportExcel = () => {
    const exportData = filteredTransactions.map(t => ({
      "Transaction ID": t.id,
      "Date": t.date,
      "Description": t.description,
      "Category": t.category,
      "Type": t.type,
      "Debit (INR)": t.debit,
      "Credit (INR)": t.credit,
      "Balance (INR)": t.balance,
      "Payment Mode": t.paymentMode,
      "Reference": t.reference
    }));
    exportToExcel(exportData, `Accounting_General_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Accounting ledger exported to Excel spreadsheet (.xlsx).", "success");
  };

  const columns = [
    {
      header: 'Txn ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    { header: 'Date', key: 'date', render: (val) => formatDate(val) },
    {
      header: 'Description & Reference',
      key: 'description',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Ref: {row.reference || 'N/A'} • {row.paymentMode}</div>
        </div>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => (
        <span style={{ fontSize: '0.76rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-surface-muted)', fontWeight: 600 }}>
          {val}
        </span>
      )
    },
    {
      header: 'Debit (Dr)',
      key: 'debit',
      render: (val) => (
        <span style={{ fontWeight: 700, color: val > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
          {val > 0 ? `-${formatINR(val)}` : '-'}
        </span>
      )
    },
    {
      header: 'Credit (Cr)',
      key: 'credit',
      render: (val) => (
        <span style={{ fontWeight: 700, color: val > 0 ? 'var(--status-success-text)' : 'var(--text-muted)' }}>
          {val > 0 ? `+${formatINR(val)}` : '-'}
        </span>
      )
    },
    {
      header: 'Balance',
      key: 'balance',
      render: (val) => <span style={{ fontWeight: 800 }}>{formatINR(val)}</span>
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Accounting & General Ledger</h1>
          <p>Institutional chart of accounts, income/expense vouchers, and treasury cash balances.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsIncomeModalOpen(true)}>
            <Plus size={16} />
            <span>+ Add Income</span>
          </button>
          <button className="btn btn-danger" onClick={() => setIsExpenseModalOpen(true)}>
            <Plus size={16} />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics KPI Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Income"
          value={formatINR(summary.totalIncome)}
          icon={TrendingUp}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="↑ 18% YTD"
          trendType="positive"
        />
        <StatCard
          title="Total Expenses"
          value={formatINR(summary.totalExpenses)}
          icon={TrendingDown}
          iconColor="#ef4444"
          iconBg="rgba(239, 68, 68, 0.12)"
          trend="Operating costs"
          trendType="neutral"
        />
        <StatCard
          title="Cash in Vault / Drawers"
          value={formatINR(summary.cashBalance)}
          icon={Wallet}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.12)"
          trend="Daily counter liquidity"
        />
        <StatCard
          title="Institutional Bank Balance"
          value={formatINR(summary.bankBalance)}
          icon={Building}
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          trend="Treasury bank deposits"
          trendType="positive"
        />
      </div>

      {/* Tabs & Transactions Table */}
      <div className="card">
        <div style={{ padding: '16px 20px 0' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <Table
          columns={columns}
          data={filteredTransactions}
          keyField="id"
          emptyMessage="No ledger entries found."
        />
      </div>

      {/* Add Income & Expense Modals */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSuccess={loadData}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
