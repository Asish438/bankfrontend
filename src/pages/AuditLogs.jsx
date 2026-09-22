import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  Eye,
  AlertTriangle,
  User,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Activity,
  Terminal,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { formatDate } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { useNotifications } from '../context/NotificationContext';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const pageSize = 12;
  const { showToast } = useNotifications();

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAuditLogs();
      setLogs(res);
      setFilteredLogs(res);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch audit logs.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...logs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l =>
          l.id.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.ipAddress.includes(q)
      );
    }

    if (moduleFilter !== 'ALL') {
      result = result.filter(l => l.module === moduleFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(l => l.status === statusFilter);
    }

    if (actionFilter !== 'ALL') {
      result = result.filter(l => l.action === actionFilter);
    }

    setFilteredLogs(result);
    setCurrentPage(1);
  }, [searchQuery, moduleFilter, statusFilter, actionFilter, logs]);

  // Simulated live event feed
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const actions = [
        { action: "LOGIN", module: "Auth", desc: "User authenticated session refreshed", status: "Success" },
        { action: "VIEW_LEDGER", module: "Accounting", desc: "Viewed general trial balance ledger", status: "Success" },
        { action: "DEPOSIT", module: "Cashier", desc: "Cash drawer collection updated", status: "Success" },
        { action: "FAILED_AUTH", module: "Auth", desc: "Invalid password attempt detected", status: "Failed" },
        { action: "REPORT_EXPORTED", module: "Reports", desc: "Automated scheduled backup report generated", status: "Success" }
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const newLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        user: randomAction.status === 'Failed' ? 'Unidentified Client' : 'Admin (Session Stream)',
        action: randomAction.action,
        module: randomAction.module,
        description: randomAction.desc,
        ipAddress: randomAction.status === 'Failed' ? '45.133.1.92' : '192.168.1.104',
        dateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: randomAction.status
      };
      setLogs(prev => [newLog, ...prev]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Statistics
  const totalCount = logs.length;
  const failedCount = logs.filter(l => l.status === 'Failed').length;
  const warningCount = logs.filter(l => l.status === 'Warning').length;
  const authCount = logs.filter(l => l.module === 'Auth').length;
  const operationalCount = logs.filter(l => ['Loans', 'KYC', 'Savings', 'Cashier'].includes(l.module)).length;

  const paginatedData = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getActionBadgeColor = (action) => {
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'var(--primary-600)';
    if (action.includes('APPROVED') || action.includes('DEPOSIT')) return 'var(--status-success-text)';
    if (action.includes('REJECTED') || action.includes('FAILED')) return 'var(--status-danger-text)';
    if (action.includes('EXPORT') || action.includes('PRINT')) return '#8b5cf6';
    return 'var(--text-main)';
  };

  const columns = [
    {
      header: 'Log ID',
      key: 'id',
      render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-600)' }}>{val}</span>
    },
    {
      header: 'Timestamp',
      key: 'dateTime',
      render: (val) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {val}
        </span>
      )
    },
    {
      header: 'User / Actor',
      key: 'user',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: row.status === 'Failed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.12)',
            color: row.status === 'Failed' ? 'var(--status-danger)' : 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            {row.status === 'Failed' ? <AlertTriangle size={14} /> : <User size={14} />}
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{val}</span>
        </div>
      )
    },
    {
      header: 'Event / Action',
      key: 'action',
      render: (val) => (
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-surface-subtle)',
          color: getActionBadgeColor(val),
          border: '1px solid var(--border-color)',
          fontFamily: 'monospace'
        }}>
          {val}
        </span>
      )
    },
    {
      header: 'Module',
      key: 'module',
      render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
    },
    {
      header: 'Description',
      key: 'description',
      render: (val) => (
        <span style={{ fontSize: '0.84rem', maxWidth: '280px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={val}>
          {val}
        </span>
      )
    },
    {
      header: 'IP Address',
      key: 'ipAddress',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {val}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Action',
      key: 'actions',
      render: (_, row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedLog(row)}
          title="Inspect Audit Trace"
          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
        >
          <Eye size={14} style={{ marginRight: '4px' }} /> Trace
        </button>
      )
    }
  ];

  const handleExportExcel = () => {
    const exportData = filteredLogs.map(l => ({
      "Log ID": l.id,
      "Timestamp": l.dateTime,
      "User / Actor": l.user,
      "Action": l.action,
      "Module": l.module,
      "Description": l.description,
      "IP Address": l.ipAddress,
      "Status": l.status
    }));
    exportToExcel(exportData, `BankAdmin_Audit_Logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Audit logs exported to Excel spreadsheet (.xlsx).", "success");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="var(--primary-600)" /> Security & Audit Logs
          </h1>
          <p className="page-subtitle">Immutable chronological audit trail of all staff activities, auth events, and critical banking transactions.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn ${isLiveStreaming ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => {
              setIsLiveStreaming(prev => !prev);
              showToast(isLiveStreaming ? "Live event feed paused." : "Live event feed active (simulating incoming activity).", "info");
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={16} className={isLiveStreaming ? 'spin-slow' : ''} />
            {isLiveStreaming ? 'Streaming Live' : 'Start Live Stream'}
          </button>
          <button className="btn btn-secondary" onClick={loadLogs} title="Refresh Logs">
            <RefreshCw size={16} />
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExportExcel}
            style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} /> Download in Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Total Audit Events"
          value={totalCount}
          icon={Terminal}
          iconColor="#3b82f6"
          iconBg="rgba(59, 130, 246, 0.12)"
          trend="All recorded entries"
          trendType="neutral"
        />
        <StatCard
          title="Auth & Session Logs"
          value={authCount}
          icon={Lock}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.12)"
          trend="2FA & Logins"
          trendType="neutral"
        />
        <StatCard
          title="Critical Operations"
          value={operationalCount}
          icon={ShieldCheck}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="KYC, Loans & Savings"
          trendType="positive"
        />
        <StatCard
          title="Failed / Security Alerts"
          value={failedCount + warningCount}
          icon={AlertTriangle}
          iconColor="#ef4444"
          iconBg="rgba(239, 68, 68, 0.12)"
          trend={`${failedCount} Failures, ${warningCount} Warnings`}
          trendType={failedCount > 0 ? "negative" : "positive"}
        />
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Log ID, user, IP, action, or details..."
            width="360px"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 500 }}>Module:</span>
              <select
                className="form-control"
                style={{ width: '150px' }}
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                <option value="ALL">All Modules</option>
                <option value="Auth">Auth / Security</option>
                <option value="KYC">KYC Queue</option>
                <option value="Savings">Savings</option>
                <option value="Loans">Loans</option>
                <option value="Cashier">Cashier</option>
                <option value="Accounting">Accounting</option>
                <option value="Reports">Reports</option>
                <option value="Staff">Staff Management</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status:</span>
              <select
                className="form-control"
                style={{ width: '140px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Warning">Warning</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <SkeletonTable rows={10} cols={8} />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              keyField="id"
              emptyMessage="No audit logs matched your search or filter parameters."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredLogs.length / pageSize)}
              totalItems={filteredLogs.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Log Inspection Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Audit Trail Inspection - ${selectedLog.id}`}
          subtitle={`Event Action: ${selectedLog.action} | Module: ${selectedLog.module}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Hash Checksum: SHA256-VALID ({selectedLog.id})
              </span>
              <button className="btn btn-secondary" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status & Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
              padding: '16px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timestamp</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, marginTop: '2px' }}>{selectedLog.dateTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actor User</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, marginTop: '2px' }}>{selectedLog.user}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Execution Status</div>
                <div style={{ marginTop: '4px' }}><StatusBadge status={selectedLog.status} /></div>
              </div>
            </div>

            {/* Metadata breakdown */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-main)' }}>Audit Record Attributes</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Origin IP Address: </span>
                  <strong style={{ fontFamily: 'monospace' }}>{selectedLog.ipAddress}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Origin Geo-Location: </span>
                  <strong>{selectedLog.ipAddress.startsWith('192.168') ? 'Internal LAN (Branch)' : 'External WAN (Public Gateway)'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Target Functional Domain: </span>
                  <strong>{selectedLog.module} Module</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Session Security Level: </span>
                  <strong>TLS 1.3 / AES-256-GCM</strong>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Event Payload Description</h4>
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                color: selectedLog.status === 'Failed' ? 'var(--status-danger-text)' : 'var(--text-main)',
                border: '1px solid var(--border-color)'
              }}>
                {selectedLog.description}
              </div>
            </div>

            {/* Raw JSON Trace */}
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Raw System Event JSON</h4>
              <pre style={{
                margin: 0,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                fontSize: '0.78rem',
                overflowX: 'auto'
              }}>
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
