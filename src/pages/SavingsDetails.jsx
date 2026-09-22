import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  User,
  Calendar,
  ArrowLeft,
  Download,
  Printer,
  FileSpreadsheet,
  Lock,
  Unlock,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate, formatMobile } from '../services/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { Table } from '../components/common/Table';
import { LoadingState, Breadcrumb } from '../components/common/DisplayComponents';
import { exportToExcel, printDocument } from '../services/exportService';
import { useNotifications } from '../context/NotificationContext';

export const SavingsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  const fetchAccount = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSavingsById(id);
      setAccount(res);
    } catch (e) {
      console.error(e);
      showToast("Account not found.", "error");
      navigate('/savings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [id]);

  if (isLoading || !account) {
    return <LoadingState message="Loading account ledger & transactions..." />;
  }

  const handlePrint = () => {
    printDocument();
  };

  const handleDownloadExcel = () => {
    const formattedRows = (account.transactions || []).map(t => ({
      "Transaction ID": t.id,
      "Date": t.date,
      "Type": t.type,
      "Payment Mode": t.paymentMode,
      "Amount (INR)": t.amount,
      "Balance (INR)": t.newBalance || account.balance,
      "Reference": t.referenceNo || "N/A",
      "Status": t.status || "Completed"
    }));

    exportToExcel(
      formattedRows,
      `Statement_${account.accountNumber}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    showToast("Statement exported as Excel spreadsheet (.xlsx).", "success");
  };

  const txnColumns = [
    {
      header: 'Txn ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    {
      header: 'Type',
      key: 'type',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (val, row) => (
        <span
          style={{
            fontWeight: 700,
            color: row.type === 'Withdrawal' ? 'var(--status-danger)' : 'var(--status-success-text)'
          }}
        >
          {row.type === 'Withdrawal' ? `-${formatINR(val)}` : `+${formatINR(val)}`}
        </span>
      )
    },
    {
      header: 'Previous Balance',
      key: 'previousBalance',
      render: (val) => formatINR(val || 0)
    },
    {
      header: 'New Balance',
      key: 'newBalance',
      render: (val) => <strong style={{ color: 'var(--text-primary)' }}>{formatINR(val || account.balance)}</strong>
    },
    {
      header: 'Payment Mode',
      key: 'paymentMode',
      render: (val) => (
        <span style={{ fontSize: '0.76rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-surface-muted)', fontWeight: 600 }}>
          {val}
        </span>
      )
    },
    { header: 'Date', key: 'date' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Breadcrumbs */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Savings Accounts', link: '/savings' },
            { label: account.accountNumber }
          ]}
        />
        <div style={{ marginTop: '8px' }}>
          <Link to="/savings" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Savings</span>
          </Link>
        </div>
      </div>

      {/* Account Overview Header */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.4rem', margin: 0 }}>{account.accountNumber}</h1>
              <StatusBadge status={account.status} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} />
                <Link to={`/members/${account.memberId}`} style={{ fontWeight: 600 }}>
                  {account.memberName} ({account.memberId})
                </Link>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building size={14} />
                <span>{account.branch}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} />
                <span>Opened {formatDate(account.openingDate)}</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', padding: '10px 16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Current Balance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-success-text)' }}>{formatINR(account.balance)}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={handleDownloadExcel}
                style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={16} />
                <span>Download Statement (Excel)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Interest Rate</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px', color: 'var(--primary-600)' }}>
            {account.interestRate}% per annum
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>Calculated daily, credited quarterly</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registered Nominee</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
            {account.nominee || "Nominee Recorded"}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>Verified with membership form</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Last Transaction</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
            {formatDate(account.lastTransactionDate)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>Branch Cashier / UPI</div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Transaction Ledger</h3>
            <p className="card-subtitle">Complete credits, debits, and balance records</p>
          </div>
        </div>
        <Table
          columns={txnColumns}
          data={account.transactions || []}
          keyField="id"
          emptyMessage="No transactions recorded for this savings account."
        />
      </div>

      <StatementPrintModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        account={account}
      />
    </div>
  );
};
