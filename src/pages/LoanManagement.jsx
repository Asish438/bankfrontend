import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wallet,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Tabs } from '../components/common/FormControls';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { LoanApprovalModal, LoanRejectModal } from '../components/modals/LoanModals';
import { useNotifications } from '../context/NotificationContext';

export const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [approveLoanItem, setApproveLoanItem] = useState(null);
  const [rejectLoanItem, setRejectLoanItem] = useState(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadLoans = async () => {
    try {
      setIsLoading(true);
      const res = await api.getLoans();
      const list = Array.isArray(res) ? res : [];
      setLoans(list);
      setFilteredLoans(list);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch loans.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  useEffect(() => {
    let result = Array.isArray(loans) ? [...loans] : [];

    if (activeTab === 'Applications') {
      result = result.filter(l => l.status === 'Pending' || l.status === 'Under Review');
    } else if (activeTab === 'Active Loans') {
      result = result.filter(l => l.status === 'Active');
    } else if (activeTab === 'Completed') {
      result = result.filter(l => l.status === 'Completed');
    } else if (activeTab === 'Rejected') {
      result = result.filter(l => l.status === 'Rejected');
    } else if (activeTab === 'Overdue') {
      result = result.filter(l => l.status === 'Overdue');
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l =>
          (l.loanId && l.loanId.toLowerCase().includes(q)) ||
          (l.memberName && l.memberName.toLowerCase().includes(q)) ||
          (l.loanType && l.loanType.toLowerCase().includes(q)) ||
          (l.memberId && l.memberId.toLowerCase().includes(q))
      );
    }

    setFilteredLoans(result);
    setCurrentPage(1);
  }, [activeTab, searchQuery, loans]);

  const totalCount = Array.isArray(loans) ? loans.length : 0;
  const pendingCount = Array.isArray(loans) ? loans.filter(l => l.status === 'Pending' || l.status === 'Under Review').length : 0;
  const activeCount = Array.isArray(loans) ? loans.filter(l => l.status === 'Active').length : 0;
  const overdueCount = Array.isArray(loans) ? loans.filter(l => l.status === 'Overdue').length : 0;
  const totalOutstanding = Array.isArray(loans) ? loans.reduce((acc, curr) => acc + (curr.outstandingAmount || 0), 0) : 0;

  const tabs = [
    { id: 'ALL', label: 'All Loans', badge: totalCount },
    { id: 'Applications', label: 'Applications', badge: pendingCount },
    { id: 'Active Loans', label: 'Active Loans', badge: activeCount },
    { id: 'Overdue', label: 'Overdue', badge: overdueCount },
    { id: 'Completed', label: 'Completed', badge: Array.isArray(loans) ? loans.filter(l => l.status === 'Completed').length : 0 },
    { id: 'Rejected', label: 'Rejected', badge: Array.isArray(loans) ? loans.filter(l => l.status === 'Rejected').length : 0 }
  ];

  const handleExportExcel = () => {
    const exportData = filteredLoans.map(l => ({
      "Loan ID": l.loanId,
      "Member ID": l.memberId,
      "Member Name": l.memberName,
      "Loan Type": l.loanType,
      "Requested Amount (INR)": l.requestedAmount,
      "Approved Amount (INR)": l.approvedAmount,
      "Interest Rate": `${l.interestRate}%`,
      "Tenure (Months)": l.tenureMonths,
      "Monthly EMI (INR)": l.emiAmount,
      "Outstanding (INR)": l.outstandingAmount,
      "Status": l.status,
      "Branch": l.branch
    }));
    exportToExcel(exportData, `Institutional_Loans_Portfolio_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Loans portfolio exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredLoans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'Loan ID',
      key: 'loanId',
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
      header: 'Loan Type',
      key: 'loanType',
      render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
    },
    {
      header: 'Requested / Sanctioned',
      key: 'requestedAmount',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{formatINR(row.approvedAmount || val)}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Req: {formatINR(val)}</div>
        </div>
      )
    },
    {
      header: 'Interest & Tenure',
      key: 'interestRate',
      render: (val, row) => `${val}% (${row.tenureMonths}M)`
    },
    {
      header: 'Monthly EMI',
      key: 'emiAmount',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{formatINR(val)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Actions',
      key: 'loanId',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/loans/${val}`)}
            title="View Loan Details & EMI Schedule"
            style={{ padding: '5px 8px' }}
          >
            <Eye size={14} />
          </button>
          {(row.status === 'Pending' || row.status === 'Under Review') && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setApproveLoanItem(row)}
                title="Sanction & Approve Loan"
                style={{ padding: '5px 8px', color: 'var(--status-success-text)' }}
              >
                <CheckCircle2 size={14} />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setRejectLoanItem(row)}
                title="Reject Loan Application"
                style={{ padding: '5px 8px', color: 'var(--status-danger)' }}
              >
                <XCircle size={14} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Loan Management</h1>
          <p>Credit underwriting, appraisal, loan origination, and amortization schedules.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 5 Statistics KPI Cards */}
      <div className="stat-card-grid-5">
        <StatCard
          title="Total Loans"
          value={totalCount}
          icon={Wallet}
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          trend="Institutional portfolio"
        />
        <StatCard
          title="Pending Applications"
          value={pendingCount}
          icon={Clock}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.12)"
          trend="Awaiting committee"
          trendType="warning"
        />
        <StatCard
          title="Active Loans"
          value={activeCount}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="Repayment cycle"
          trendType="positive"
        />
        <StatCard
          title="Overdue Loans"
          value={overdueCount}
          icon={AlertTriangle}
          iconColor="#ef4444"
          iconBg="rgba(239, 68, 68, 0.12)"
          trend="Default alert"
          trendType="negative"
        />
        <StatCard
          title="Total Outstanding"
          value={formatINR(totalOutstanding)}
          icon={Wallet}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.12)"
          trend="Active principal balance"
        />
      </div>

      {/* Tabs & Table Card */}
      <div className="card">
        <div style={{ padding: '16px 20px 0' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search loan ID, member name or loan type..."
            width="340px"
          />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredLoans.length}</strong> loan files
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} cols={8} />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              keyField="loanId"
              emptyMessage="No loan records found in this category."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredLoans.length / pageSize)}
              totalItems={filteredLoans.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Approval & Rejection Modals */}
      <LoanApprovalModal
        isOpen={Boolean(approveLoanItem)}
        onClose={() => setApproveLoanItem(null)}
        loan={approveLoanItem}
        onSuccess={loadLoans}
      />

      <LoanRejectModal
        isOpen={Boolean(rejectLoanItem)}
        onClose={() => setRejectLoanItem(null)}
        loan={rejectLoanItem}
        onSuccess={loadLoans}
      />
    </div>
  );
};
