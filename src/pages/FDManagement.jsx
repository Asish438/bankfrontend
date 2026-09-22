import React, { useState, useEffect } from 'react';
import {
  Landmark,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  XCircle,
  Printer,
  Eye,
  FileSpreadsheet
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
import { ReceiptPrintModal } from '../components/modals/PrintModals';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useNotifications } from '../context/NotificationContext';

export const FDManagement = () => {
  const [fdList, setFdList] = useState([]);
  const [filteredFd, setFilteredFd] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedFd, setSelectedFd] = useState(null);
  const [receiptFd, setReceiptFd] = useState(null);
  const [renewFdItem, setRenewFdItem] = useState(null);
  const [closeFdItem, setCloseFdItem] = useState(null);
  const { showToast } = useNotifications();

  const loadFD = async () => {
    try {
      setIsLoading(true);
      const res = await api.getFDAccounts();
      const list = Array.isArray(res) ? res : [];
      setFdList(list);
      setFilteredFd(list);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch FD accounts.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFD();
  }, []);

  useEffect(() => {
    let result = Array.isArray(fdList) ? [...fdList] : [];

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        f =>
          (f.fdNumber && f.fdNumber.toLowerCase().includes(q)) ||
          (f.memberName && f.memberName.toLowerCase().includes(q)) ||
          (f.memberId && f.memberId.toLowerCase().includes(q)) ||
          (f.mobile && f.mobile.includes(q))
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(f => f.status === statusFilter);
    }

    setFilteredFd(result);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, fdList]);

  const totalCount = Array.isArray(fdList) ? fdList.length : 0;
  const activeCount = Array.isArray(fdList) ? fdList.filter(f => f.status === 'Active').length : 0;
  const maturingSoonCount = Array.isArray(fdList) ? fdList.filter(f => f.status === 'Maturing Soon').length : 0;
  const maturedCount = Array.isArray(fdList) ? fdList.filter(f => f.status === 'Matured').length : 0;

  const handleRenew = async () => {
    if (!renewFdItem) return;
    try {
      await api.renewFD(renewFdItem.fdNumber);
      showToast(`Fixed Deposit ${renewFdItem.fdNumber} renewed successfully!`, "success");
      setRenewFdItem(null);
      loadFD();
    } catch (e) {
      showToast("Error renewing FD.", "error");
    }
  };

  const handleClose = async () => {
    if (!closeFdItem) return;
    try {
      await api.closeFD(closeFdItem.fdNumber);
      showToast(`Fixed Deposit ${closeFdItem.fdNumber} has been closed.`, "warning");
      setCloseFdItem(null);
      loadFD();
    } catch (e) {
      showToast("Error closing FD.", "error");
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredFd.map(f => ({
      "FD Certificate": f.fdNumber,
      "Member ID": f.memberId,
      "Member Name": f.memberName,
      "Principal Amount (INR)": f.principalAmount,
      "Interest Rate": `${f.interestRate}%`,
      "Tenure (Months)": f.tenureMonths,
      "Start Date": f.startDate,
      "Maturity Date": f.maturityDate,
      "Maturity Amount (INR)": f.maturityAmount,
      "Status": f.status,
      "Auto Renew": f.autoRenew ? 'Yes' : 'No'
    }));
    exportToExcel(exportData, `Fixed_Deposits_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("FD ledger exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredFd.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'FD Number',
      key: 'fdNumber',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{val}</span>
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
      header: 'Principal Amount',
      key: 'principalAmount',
      render: (val) => <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{formatINR(val)}</span>
    },
    {
      header: 'Interest Rate',
      key: 'interestRate',
      render: (val) => `${val}% p.a.`
    },
    {
      header: 'Tenure',
      key: 'tenureMonths',
      render: (val) => `${val} Mo`
    },
    {
      header: 'Start Date',
      key: 'startDate',
      render: (val) => formatDate(val)
    },
    {
      header: 'Maturity Date',
      key: 'maturityDate',
      render: (val) => formatDate(val)
    },
    {
      header: 'Maturity Amount',
      key: 'maturityAmount',
      render: (val) => <span style={{ fontWeight: 800, color: 'var(--status-success-text)' }}>{formatINR(val)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Actions',
      key: 'fdNumber',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedFd(row)}
            title="View FD Certificate"
            style={{ padding: '5px 8px' }}
          >
            <Eye size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setReceiptFd({
                receiptNo: `RCP-FD-${row.fdNumber}`,
                date: row.startDate,
                memberId: row.memberId,
                memberName: row.memberName,
                collectionType: "Fixed Deposit Certificate",
                paymentMode: "Bank Transfer",
                amount: row.principalAmount,
                collectedBy: "Authorized Officer",
                status: "Issued",
                branch: row.branch
              });
            }}
            title="Print FD Certificate Receipt"
            style={{ padding: '5px 8px' }}
          >
            <Printer size={14} />
          </button>
          {row.status === 'Maturing Soon' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setRenewFdItem(row)}
              title="Renew Term"
              style={{ padding: '5px 8px', color: 'var(--primary-600)' }}
            >
              <RefreshCw size={14} />
            </button>
          )}
          {row.status === 'Active' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCloseFdItem(row)}
              title="Pre-mature / Close FD"
              style={{ padding: '5px 8px', color: 'var(--status-danger)' }}
            >
              <XCircle size={14} />
            </button>
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
          <h1>Fixed Deposit Management</h1>
          <p>Term deposits, investment certificates, maturity yields, and auto-renewals.</p>
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
          title="Total FD Accounts"
          value={totalCount}
          icon={Landmark}
          iconColor="#d97706"
          iconBg="rgba(217, 119, 6, 0.12)"
          trend="↑ 18%"
          trendType="positive"
        />
        <StatCard
          title="Active FD"
          value={activeCount}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="Yield generating"
          trendType="positive"
        />
        <StatCard
          title="Maturing Soon"
          value={maturingSoonCount}
          icon={AlertTriangle}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.12)"
          trend="Action required"
          trendType="warning"
        />
        <StatCard
          title="Matured FD"
          value={maturedCount}
          icon={TrendingUp}
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.12)"
          trend="Ready for payout"
          trendType="positive"
        />
      </div>

      {/* Table Card */}
      <div className="card">
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search FD certificate number, member name or ID..."
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
              <option value="Maturing Soon">Maturing Soon</option>
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
              keyField="fdNumber"
              emptyMessage="No fixed deposit records found."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredFd.length / pageSize)}
              totalItems={filteredFd.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* FD Details Modal */}
      {selectedFd && (
        <Modal
          isOpen={Boolean(selectedFd)}
          onClose={() => setSelectedFd(null)}
          title={`Fixed Deposit Certificate - ${selectedFd.fdNumber}`}
          subtitle={`Holder: ${selectedFd.memberName} (${selectedFd.memberId})`}
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const item = selectedFd;
                  setSelectedFd(null);
                  setReceiptFd({
                    receiptNo: `RCP-FD-${item.fdNumber}`,
                    date: item.startDate,
                    memberId: item.memberId,
                    memberName: item.memberName,
                    collectionType: "Fixed Deposit Certificate",
                    paymentMode: "Bank Transfer",
                    amount: item.principalAmount,
                    collectedBy: "Authorized Officer",
                    status: "Issued",
                    branch: item.branch
                  });
                }}
              >
                <Printer size={16} />
                <span>Print Certificate</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedFd(null)}>
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Principal Amount</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>{formatINR(selectedFd.principalAmount)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Maturity Amount</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-success-text)' }}>{formatINR(selectedFd.maturityAmount)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Interest Rate & Tenure</span>
                <div style={{ fontWeight: 600 }}>{selectedFd.interestRate}% p.a. ({selectedFd.tenureMonths} Months)</div>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Maturity Date</span>
                <div style={{ fontWeight: 600 }}>{formatDate(selectedFd.maturityDate)}</div>
              </div>
            </div>

            <div style={{ padding: '12px 16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Certificate Status</span>
                <StatusBadge status={selectedFd.status} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Auto-Renewal on Maturity</span>
                <span style={{ fontWeight: 600 }}>{selectedFd.autoRenew ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptPrintModal
        isOpen={Boolean(receiptFd)}
        onClose={() => setReceiptFd(null)}
        receipt={receiptFd}
      />

      {/* Renew Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(renewFdItem)}
        onClose={() => setRenewFdItem(null)}
        onConfirm={handleRenew}
        title="Renew Fixed Deposit Term"
        message={`Are you sure you want to renew Fixed Deposit ${renewFdItem?.fdNumber} for another ${renewFdItem?.tenureMonths} months tenure at ${renewFdItem?.interestRate}% interest rate?`}
        confirmText="Confirm Renewal"
        type="info"
      />

      {/* Close Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(closeFdItem)}
        onClose={() => setCloseFdItem(null)}
        onConfirm={handleClose}
        title="Execute Pre-mature / Maturity Closure"
        message={`Are you sure you want to close FD ${closeFdItem?.fdNumber} and transfer funds to member's linked savings account?`}
        confirmText="Close FD"
        type="danger"
      />
    </div>
  );
};
