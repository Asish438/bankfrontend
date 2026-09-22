import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  ShieldCheck,
  UserX,
  FileSpreadsheet,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { formatDate, formatMobile } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { KYCReviewModal } from '../components/modals/KYCModals';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useNotifications } from '../context/NotificationContext';

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedKycMember, setSelectedKycMember] = useState(null);
  const [toggleStatusMember, setToggleStatusMember] = useState(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMembers();
      setMembers(res);
      setFilteredMembers(res);
    } catch (err) {
      console.error(err);
      showToast("Unable to load members list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...members];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.mobile.includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(m => m.accountStatus === statusFilter);
    }

    if (kycFilter !== 'ALL') {
      result = result.filter(m => m.kycStatus === kycFilter);
    }

    if (branchFilter !== 'ALL') {
      result = result.filter(m => m.branch.includes(branchFilter));
    }

    setFilteredMembers(result);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, kycFilter, branchFilter, members]);

  // Statistics calculation
  const totalCount = members.length;
  const activeCount = members.filter(m => m.accountStatus === 'Active').length;
  const pendingKycCount = members.filter(m => m.kycStatus === 'Pending' || m.kycStatus === 'Under Review').length;
  const approvedKycCount = members.filter(m => m.kycStatus === 'Approved').length;
  const rejectedKycCount = members.filter(m => m.kycStatus === 'Rejected').length;

  const handleToggleMemberStatus = async () => {
    if (!toggleStatusMember) return;
    const newStatus = toggleStatusMember.accountStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.updateMember(toggleStatusMember.id, { accountStatus: newStatus });
      showToast(`Member ${toggleStatusMember.name} set to ${newStatus}.`, "success");
      setToggleStatusMember(null);
      loadMembers();
    } catch (e) {
      showToast("Error updating member status.", "error");
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredMembers.map(m => ({
      "Member ID": m.id,
      "Full Name": m.name,
      "Mobile": m.mobile,
      "Email": m.email,
      "Branch": m.branch,
      "KYC Status": m.kycStatus,
      "Account Status": m.accountStatus,
      "Joining Date": m.joiningDate
    }));
    exportToExcel(exportData, `BankAdmin_Members_Directory_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Members data exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'Member ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{val}</span>
    },
    {
      header: 'Name',
      key: 'name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={row.documents?.photo || row.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={val}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-strong)' }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{val}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{row.occupation || row.city}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Mobile',
      key: 'mobile',
      render: (val) => formatMobile(val)
    },
    {
      header: 'Email',
      key: 'email',
      render: (val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{val}</span>
    },
    {
      header: 'Branch',
      key: 'branch',
      render: (val) => (
        <span style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
          <Building size={13} color="var(--text-muted)" />
          <span>{val}</span>
        </span>
      )
    },
    {
      header: 'KYC Status',
      key: 'kycStatus',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Account Status',
      key: 'accountStatus',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Joining Date',
      key: 'joiningDate',
      render: (val) => formatDate(val)
    },
    {
      header: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/members/${val}`)}
            title="View Member 360 Profile"
            style={{ padding: '5px 8px' }}
          >
            <Eye size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedKycMember(row)}
            title="KYC Verification Actions"
            style={{ padding: '5px 8px', color: 'var(--primary-600)' }}
          >
            <ShieldCheck size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setToggleStatusMember(row)}
            title={row.accountStatus === 'Active' ? 'Deactivate Member' : 'Activate Member'}
            style={{ padding: '5px 8px', color: row.accountStatus === 'Active' ? 'var(--status-danger)' : 'var(--status-success-text)' }}
          >
            {row.accountStatus === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
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
          <h1>Members & KYC</h1>
          <p>Manage members, profiles and KYC verification.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
          <Link to="/members/add" className="btn btn-primary">
            <Plus size={16} />
            <span>+ Add Member</span>
          </Link>
        </div>
      </div>

      {/* 5 Statistics KPI Cards */}
      <div className="stat-card-grid-5">
        <StatCard
          title="Total Members"
          value={totalCount}
          icon={Users}
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          trend="↑ Active Base"
          trendType="positive"
        />
        <StatCard
          title="Active Members"
          value={activeCount}
          icon={UserCheck}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend={`${Math.round((activeCount / (totalCount || 1)) * 100)}% active`}
          trendType="positive"
        />
        <StatCard
          title="Pending KYC"
          value={pendingKycCount}
          icon={Clock}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.12)"
          trend="Action required"
          trendType="warning"
        />
        <StatCard
          title="KYC Approved"
          value={approvedKycCount}
          icon={CheckCircle}
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.12)"
          trend="Verified base"
          trendType="positive"
        />
        <StatCard
          title="KYC Rejected"
          value={rejectedKycCount}
          icon={XCircle}
          iconColor="#ef4444"
          iconBg="rgba(239, 68, 68, 0.12)"
          trend="Requires follow-up"
          trendType="negative"
        />
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card">
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, member ID or mobile..."
            width="340px"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <select
              className="form-control"
              style={{ width: '160px' }}
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
            >
              <option value="ALL">All KYC Statuses</option>
              <option value="Approved">KYC Approved</option>
              <option value="Pending">KYC Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">KYC Rejected</option>
            </select>

            <select
              className="form-control"
              style={{ width: '170px' }}
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="ALL">All Branches</option>
              <option value="Bhubaneswar">Bhubaneswar</option>
              <option value="Cuttack">Cuttack</option>
              <option value="Puri">Puri</option>
              <option value="Rourkela">Rourkela</option>
              <option value="Sambalpur">Sambalpur</option>
              <option value="Balasore">Balasore</option>
            </select>
          </div>
        </div>

        {/* Member Table */}
        {isLoading ? (
          <SkeletonTable rows={8} cols={8} />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              keyField="id"
              emptyMessage="No members found matching the specified filters."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredMembers.length / pageSize)}
              totalItems={filteredMembers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* KYC Review Modal */}
      <KYCReviewModal
        isOpen={Boolean(selectedKycMember)}
        onClose={() => setSelectedKycMember(null)}
        member={selectedKycMember}
        onStatusUpdated={loadMembers}
      />

      {/* Deactivate/Activate Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(toggleStatusMember)}
        onClose={() => setToggleStatusMember(null)}
        onConfirm={handleToggleMemberStatus}
        title={toggleStatusMember?.accountStatus === 'Active' ? 'Deactivate Member Profile' : 'Reactivate Member Profile'}
        message={`Are you sure you want to change status for ${toggleStatusMember?.name} (${toggleStatusMember?.id}) to ${toggleStatusMember?.accountStatus === 'Active' ? 'Inactive' : 'Active'}?`}
        confirmText={toggleStatusMember?.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
        type={toggleStatusMember?.accountStatus === 'Active' ? 'danger' : 'success'}
      />
    </div>
  );
};
