import React, { useState, useEffect } from 'react';
import {
  PiggyBank,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  FileSpreadsheet,
  Building,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { useNotifications } from '../context/NotificationContext';

export const RDManagement = () => {
  const [rdList, setRdList] = useState([]);
  const [filteredRd, setFilteredRd] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRd, setSelectedRd] = useState(null);
  const pageSize = 10;
  const { showToast } = useNotifications();

  const loadRD = async () => {
    try {
      setIsLoading(true);
      const res = await api.getRDAccounts();
      setRdList(res);
      setFilteredRd(res);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch RD accounts.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRD();
  }, []);

  useEffect(() => {
    let result = [...rdList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.rdNumber.toLowerCase().includes(q) ||
          r.memberName.toLowerCase().includes(q) ||
          r.memberId.toLowerCase().includes(q) ||
          r.mobile.includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(r => r.status === statusFilter);
    }

    setFilteredRd(result);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, rdList]);

  const totalCount = rdList.length;
  const activeCount = rdList.filter(r => r.status === 'Active').length;
  const maturedCount = rdList.filter(r => r.status === 'Matured').length;
  const pendingCount = rdList.filter(r => r.status === 'Pending').length;

  const handleExportExcel = () => {
    const exportData = filteredRd.map(r => ({
      "RD Number": r.rdNumber,
      "Member ID": r.memberId,
      "Member Name": r.memberName,
      "Monthly Installment (INR)": r.installmentAmount,
      "Frequency": r.frequency,
      "Interest Rate": `${r.interestRate}%`,
      "Start Date": r.startDate,
      "Maturity Date": r.maturityDate,
      "Maturity Amount (INR)": r.maturityAmount,
      "Paid Installments": `${r.paidInstallments} / ${r.totalInstallments}`,
      "Status": r.status
    }));
    exportToExcel(exportData, `Recurring_Deposits_Portfolio_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("RD portfolio exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredRd.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'RD Number',
      key: 'rdNumber',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--status-purple-text)' }}>{val}</span>
    },
    {
      header: 'Member Name',
      key: 'memberName',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {row.memberId}</div>
        </div>
      )
    },
    {
      header: 'Monthly Amount',
      key: 'installmentAmount',
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--status-purple-text)' }}>
          {formatINR(val)}
        </span>
      )
    },
    {
      header: 'Tenure',
      key: 'tenureMonths',
      render: (val) => <span>{val} Months</span>
    },
    {
      header: 'Installments',
      key: 'paidInstallments',
      render: (val, row) => (
        <div style={{ minWidth: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
            <span>{val}/{row.totalInstallments}</span>
            <span>{Math.round((val / row.totalInstallments) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(val / row.totalInstallments) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--status-purple)',
                borderRadius: '3px'
              }}
            ></div>
          </div>
        </div>
      )
    },
    {
      header: 'Maturity Amount',
      key: 'maturityAmount',
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--status-success-text)' }}>
          {formatINR(val)}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedRd(row)}
          title="View RD Ledger & Installment Schedule"
        >
          <Eye size={14} />
          <span>Ledger</span>
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Recurring Deposit Management</h1>
          <p>Monthly recurring contribution plans, interest accruals, and maturity schedules.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Total RD Accounts"
          value={totalCount}
          icon={PiggyBank}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.12)"
          trend="↑ 6%"
          trendType="positive"
        />
        <StatCard
          title="Active RD"
          value={activeCount}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="Regular deposits"
          trendType="positive"
        />
        <StatCard
          title="Matured RD"
          value={maturedCount}
          icon={TrendingUp}
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.12)"
          trend="Ready for payout"
          trendType="positive"
        />
        <StatCard
          title="Pending Installments"
          value={pendingCount}
          icon={Clock}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.12)"
          trend="Follow-up due"
          trendType="warning"
        />
      </div>

      {/* Table Card */}
      <div className="card">
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search RD number, member name or ID..."
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
              <option value="Pending">Pending</option>
              <option value="Matured">Matured</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} cols={8} />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              keyField="rdNumber"
              emptyMessage="No RD accounts found matching the criteria."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredRd.length / pageSize)}
              totalItems={filteredRd.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* RD Details & Installment Schedule Modal */}
      {selectedRd && (
        <Modal
          isOpen={Boolean(selectedRd)}
          onClose={() => setSelectedRd(null)}
          title={`Recurring Deposit Details - ${selectedRd.rdNumber}`}
          subtitle={`Account Holder: ${selectedRd.memberName} (${selectedRd.memberId})`}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedRd(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Overview Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Amount</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-600)' }}>{formatINR(selectedRd.installmentAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interest Rate</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRd.interestRate}% p.a.</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tenure</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRd.tenureMonths} Months</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Maturity Value</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-success-text)' }}>{formatINR(selectedRd.maturityAmount)}</div>
              </div>
            </div>

            {/* Simulated Installment Schedule Table */}
            <div>
              <h4 style={{ marginBottom: '8px' }}>Installment Ledger Schedule</h4>
              <div className="table-responsive" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Installment No.</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Paid Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: selectedRd.totalInstallments || 24 }).map((_, i) => {
                      const num = i + 1;
                      const isPaid = num <= (selectedRd.paidInstallments || 12);
                      return (
                        <tr key={num}>
                          <td style={{ fontWeight: 600 }}>Installment #{num}</td>
                          <td>2024-0{((i % 9) + 1)}-05</td>
                          <td style={{ fontWeight: 700 }}>{formatINR(selectedRd.installmentAmount)}</td>
                          <td>{isPaid ? `2024-0${((i % 9) + 1)}-04` : '-'}</td>
                          <td>
                            <StatusBadge status={isPaid ? "Paid" : "Pending"} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
