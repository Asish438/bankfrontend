import React, { useState, useEffect } from 'react';
import {
  Receipt,
  CheckCircle,
  CreditCard,
  Building,
  Printer,
  FileSpreadsheet,
  QrCode,
  DollarSign,
  Plus
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
import { ReceiptPrintModal } from '../components/modals/PrintModals';
import { useNotifications } from '../context/NotificationContext';

export const CashierCollection = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const { showToast } = useNotifications();

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const res = await api.getCollections();
      setCollections(res);
      setFilteredCollections(res);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch collection records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    let result = [...collections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.receiptNo.toLowerCase().includes(q) ||
          c.memberName.toLowerCase().includes(q) ||
          c.memberId.toLowerCase().includes(q) ||
          c.collectionType.toLowerCase().includes(q)
      );
    }

    if (modeFilter !== 'ALL') {
      result = result.filter(c => c.paymentMode === modeFilter);
    }

    setFilteredCollections(result);
    setCurrentPage(1);
  }, [searchQuery, modeFilter, collections]);

  const todayTotal = 485230;
  const monthlyTotal = 1428000;
  const cashTotal = 520000;
  const upiTotal = 610000;
  const bankTotal = 298000;

  const handleExportExcel = () => {
    const exportData = filteredCollections.map(c => ({
      "Receipt No": c.receiptNo,
      "Member ID": c.memberId,
      "Member Name": c.memberName,
      "Collection Type": c.collectionType,
      "Amount (INR)": c.amount,
      "Payment Mode": c.paymentMode,
      "Collected By": c.collectedBy,
      "Date & Time": c.date,
      "Status": c.status,
      "Branch": c.branch
    }));
    exportToExcel(exportData, `Cashier_Collection_Log_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Collection log exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredCollections.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'Receipt No.',
      key: 'receiptNo',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{val}</span>
    },
    {
      header: 'Member Name',
      key: 'memberName',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID: {row.memberId}</div>
        </div>
      )
    },
    {
      header: 'Collection Type',
      key: 'collectionType',
      render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (val) => <span style={{ fontWeight: 800, color: 'var(--status-success-text)' }}>{formatINR(val)}</span>
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
    {
      header: 'Collected By',
      key: 'collectedBy',
      render: (val) => <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{val}</span>
    },
    { header: 'Date & Time', key: 'date' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Action',
      key: 'receiptNo',
      align: 'right',
      render: (val, row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedReceipt(row)}
          title="View & Print Official Receipt"
          style={{ padding: '5px 8px' }}
        >
          <Printer size={14} />
          <span>Receipt</span>
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Cashier & Collection</h1>
          <p>Daily counter receipts, teller cash drawers, UPI collection logs, and bank deposits.</p>
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
          title="Today's Collection"
          value={formatINR(todayTotal)}
          icon={Receipt}
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.14)"
          trend="↑ 22%"
          trendType="positive"
        />
        <StatCard
          title="Monthly Collection"
          value={formatINR(monthlyTotal)}
          icon={CheckCircle}
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          trend="Current month aggregate"
          trendType="positive"
        />
        <StatCard
          title="Cash Collection"
          value={formatINR(cashTotal)}
          icon={DollarSign}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="Cash drawer entries"
        />
        <StatCard
          title="UPI Collection"
          value={formatINR(upiTotal)}
          icon={QrCode}
          iconColor="#3b82f6"
          iconBg="rgba(59, 130, 246, 0.12)"
          trend="Digital QR settlements"
        />
        <StatCard
          title="Bank Transfer"
          value={formatINR(bankTotal)}
          icon={Building}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.12)"
          trend="NEFT / RTGS / IMPS"
        />
      </div>

      {/* Table Card */}
      <div className="card">
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search receipt #, member name or collection type..."
            width="340px"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <option value="ALL">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
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
              keyField="receiptNo"
              emptyMessage="No collection logs found."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredCollections.length / pageSize)}
              totalItems={filteredCollections.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Receipt Print Modal */}
      <ReceiptPrintModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />
    </div>
  );
};
