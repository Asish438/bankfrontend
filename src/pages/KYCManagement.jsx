import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  RefreshCw,
  Search,
  Filter,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { formatDate } from '../services/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { Table } from '../components/common/Table';
import { Tabs } from '../components/common/FormControls';
import { SearchBar } from '../components/common/SearchBar';
import { KYCReviewModal } from '../components/modals/KYCModals';
import { SkeletonTable } from '../components/common/Skeletons';

export const KYCManagement = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMembers();
      setMembers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...members];

    if (activeTab !== 'ALL') {
      result = result.filter(m => m.kycStatus === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.mobile.includes(q) ||
          (m.documents?.idProof && m.documents.idProof.toLowerCase().includes(q))
      );
    }

    setFilteredMembers(result);
  }, [members, activeTab, searchQuery]);

  const pendingCount = members.filter(m => m.kycStatus === 'Pending').length;
  const underReviewCount = members.filter(m => m.kycStatus === 'Under Review').length;
  const approvedCount = members.filter(m => m.kycStatus === 'Approved').length;
  const rejectedCount = members.filter(m => m.kycStatus === 'Rejected').length;

  const tabs = [
    { id: 'ALL', label: 'All Applications', badge: members.length },
    { id: 'Pending', label: 'Pending', badge: pendingCount },
    { id: 'Under Review', label: 'Under Review', badge: underReviewCount },
    { id: 'Approved', label: 'Approved', badge: approvedCount },
    { id: 'Rejected', label: 'Rejected', badge: rejectedCount }
  ];

  const columns = [
    {
      header: 'KYC ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>KYC-{val}</span>
    },
    {
      header: 'Member',
      key: 'name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID: {row.id} • {row.mobile}</div>
        </div>
      )
    },
    {
      header: 'Document Type',
      key: 'documents',
      render: (val) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
          <FileText size={14} color="var(--primary-600)" />
          <span>{val?.idProof || "Aadhaar Card"}</span>
        </span>
      )
    },
    {
      header: 'Submitted Date',
      key: 'kycSubmittedDate',
      render: (val, row) => formatDate(val || row.joiningDate)
    },
    {
      header: 'Status',
      key: 'kycStatus',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Reviewed By',
      key: 'kycReviewedBy',
      render: (val) => <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{val || '-'}</span>
    },
    {
      header: 'Action',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setSelectedMember(row)}
        >
          <Eye size={14} />
          <span>Verify Docs</span>
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>KYC Verification Queue</h1>
          <p>Institutional identity compliance, document appraisal, and regulatory vetting.</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="card">
        <div style={{ padding: '16px 20px 0' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search member, KYC ID or document number..."
            width="340px"
          />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredMembers.length}</strong> applications
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <SkeletonTable rows={8} cols={7} />
        ) : (
          <Table
            columns={columns}
            data={filteredMembers}
            keyField="id"
            emptyMessage="No KYC applications found matching this status."
          />
        )}
      </div>

      {/* Modal Sandbox */}
      <KYCReviewModal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
        onStatusUpdated={loadData}
      />
    </div>
  );
};
